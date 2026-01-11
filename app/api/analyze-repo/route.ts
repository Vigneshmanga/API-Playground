import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    // Extract owner and repo name from URL
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!urlMatch) {
      return NextResponse.json(
        { error: "Invalid GitHub URL format" },
        { status: 400 }
      );
    }

    const [, owner, repo] = urlMatch;
    const cleanRepo = repo.replace(/\.git$/, "");

    // Fetch repository information from GitHub API
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Nani-Research-Assistant",
        },
      }
    );

    if (!repoResponse.ok) {
      return NextResponse.json(
        { error: "Repository not found or unable to access" },
        { status: 404 }
      );
    }

    const repoData = await repoResponse.json();

    // Fetch README content
    let readmeContent = "";
    try {
      const readmeResponse = await fetch(
        `https://api.github.com/repos/${owner}/${cleanRepo}/readme`,
        {
          headers: {
            Accept: "application/vnd.github.v3.raw",
            "User-Agent": "Nani-Research-Assistant",
          },
        }
      );

      if (readmeResponse.ok) {
        readmeContent = await readmeResponse.text();
        // Limit README content to avoid token limits (first 3000 chars)
        readmeContent = readmeContent.substring(0, 3000);
      }
    } catch (error) {
      console.log("README not available:", error);
      readmeContent = "No README available";
    }

    // Fetch repository languages
    const languagesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/languages`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Nani-Research-Assistant",
        },
      }
    );

    let languagesData: Record<string, number> = {};
    if (languagesResponse.ok) {
      languagesData = await languagesResponse.json();
    }

    // Try to use AI analysis, fallback to basic analysis if unavailable
    let summary = "";
    let funFacts: string[] = [];
    let usingFallback = false;

    // Helper function to generate fallback analysis
    const generateFallbackAnalysis = () => {
      // Generate a basic summary from available data
      const languages = Object.keys(languagesData).join(", ") || repoData.language || "multiple languages";
      const readmePreview = readmeContent.substring(0, 500).trim();
      const hasReadme = readmeContent !== "No README available";
      
      let fallbackSummary = `${repoData.full_name} is a ${repoData.language || "software"} project ${
        repoData.description ? `focused on ${repoData.description.toLowerCase()}` : "available on GitHub"
      }. `;
      
      if (hasReadme && readmePreview) {
        fallbackSummary += `According to the repository documentation, ${readmePreview}... `;
      }
      
      fallbackSummary += `\n\nThe project has gained significant community interest with ${repoData.stargazers_count.toLocaleString()} stars and ${repoData.forks_count.toLocaleString()} forks on GitHub. `;
      
      fallbackSummary += `It was created on ${new Date(repoData.created_at).toLocaleDateString()} and remains actively maintained, with the last update on ${new Date(repoData.updated_at).toLocaleDateString()}. `;
      
      if (Object.keys(languagesData).length > 1) {
        fallbackSummary += `The repository uses multiple programming languages including ${languages}, demonstrating a diverse technology stack.`;
      }

      // Generate basic fun facts
      const fallbackFacts = [
        `⭐ This repository has earned ${repoData.stargazers_count.toLocaleString()} stars from the GitHub community!`,
        `🔱 The project has been forked ${repoData.forks_count.toLocaleString()} times, showing active community participation`,
        `💻 Built primarily with ${repoData.language || "multiple languages"}, showcasing ${languages} in action`,
        `📅 First created on ${new Date(repoData.created_at).toLocaleDateString()}, the project has been evolving for ${Math.floor((Date.now() - new Date(repoData.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`,
        `🔄 Last updated ${new Date(repoData.updated_at).toLocaleDateString()}, with ${repoData.open_issues_count} open issues being actively discussed`,
      ];

      return { summary: fallbackSummary, funFacts: fallbackFacts };
    };

    try {
      // Initialize OpenAI with LangChain
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        throw new Error("OPENAI_NOT_CONFIGURED");
      }

      const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.7,
        openAIApiKey: openaiApiKey,
      });

      // Create prompt template for analysis
      const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert software engineer and technical analyst. Analyze the following GitHub repository and provide insights.

Repository Information:
- Name: {repoName}
- Description: {description}
- Stars: {stars}
- Forks: {forks}
- Primary Language: {language}
- Languages Used: {languages}
- Created: {created}
- Last Updated: {updated}
- Open Issues: {issues}

README Content:
{readme}

Based on this information, provide:

1. A comprehensive summary (3-4 paragraphs) that covers:
   - What the project does and its main purpose
   - Key features and technologies used
   - Target audience or use cases
   - Overall project health and activity

2. Five interesting and fun facts about this repository. These should be:
   - Unique insights or observations
   - Interesting statistics or patterns
   - Notable achievements or milestones
   - Cool technical details or approaches
   - Community engagement highlights

Format your response EXACTLY as follows:
SUMMARY:
[Your summary here]

FUN_FACTS:
1. [First fun fact]
2. [Second fun fact]
3. [Third fun fact]
4. [Fourth fun fact]
5. [Fifth fun fact]
`);

      const formattedPrompt = await promptTemplate.format({
        repoName: repoData.full_name,
        description: repoData.description || "No description provided",
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        language: repoData.language || "Not specified",
        languages: Object.keys(languagesData).join(", ") || "Not available",
        created: new Date(repoData.created_at).toLocaleDateString(),
        updated: new Date(repoData.updated_at).toLocaleDateString(),
        issues: repoData.open_issues_count,
        readme: readmeContent,
      });

      // Get AI analysis
      const response = await model.invoke(formattedPrompt);
      const analysisText = response.content.toString();

      // Parse the response
      const summaryMatch = analysisText.match(/SUMMARY:\s*([\s\S]*?)(?=FUN_FACTS:|$)/);
      const funFactsMatch = analysisText.match(/FUN_FACTS:\s*([\s\S]*?)$/);

      if (summaryMatch) {
        summary = summaryMatch[1].trim();
      }

      if (funFactsMatch) {
        const factsText = funFactsMatch[1].trim();
        funFacts = factsText
          .split(/\n/)
          .filter((line) => line.match(/^\d+\./))
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter((fact) => fact.length > 0);
      }
    } catch (aiError: any) {
      // Handle OpenAI API errors gracefully with fallback
      console.warn("AI analysis unavailable, using fallback:", aiError?.message);
      usingFallback = true;
      const fallback = generateFallbackAnalysis();
      summary = fallback.summary;
      funFacts = fallback.funFacts;
    }

    // Ensure we have at least some fun facts
    if (funFacts.length === 0) {
      funFacts = [
        `⭐ This repository has ${repoData.stargazers_count.toLocaleString()} stars!`,
        `📅 The project was created on ${new Date(repoData.created_at).toLocaleDateString()}`,
        `💻 It uses ${repoData.language || "multiple languages"} as its primary language`,
        `🔱 The community has created ${repoData.forks_count.toLocaleString()} forks`,
        `🔄 Last updated on ${new Date(repoData.updated_at).toLocaleDateString()}`,
      ];
    }

    // Prepare response
    const result = {
      summary,
      funFacts: funFacts.slice(0, 5), // Ensure max 5 facts
      repoInfo: {
        name: repoData.full_name,
        description: repoData.description || "No description available",
        language: repoData.language || "Not specified",
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
      },
      usingFallback, // Indicate if fallback analysis was used
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error analyzing repository:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while analyzing the repository",
      },
      { status: 500 }
    );
  }
}

