# Research Assistant - GitHub Summarizer Setup

## Overview
The Research Assistant feature allows you to analyze any GitHub repository and get an AI-powered summary with fun facts using OpenAI and LangChain.

## Prerequisites

1. **OpenAI API Key**: You need an OpenAI API key to use this feature.
   - Get your API key from: https://platform.openai.com/api-keys
   - The feature uses the `gpt-4o-mini` model for cost-effective analysis

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the `my-app` directory with the following content:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 2. Restart the Development Server

After adding the environment variable, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
yarn dev
```

## How to Use

1. **Navigate to Research Assistant**
   - Click on "Research Assistant" in the sidebar from the dashboard
   - Or navigate directly to: http://localhost:3000/research-assistant

2. **Enter a GitHub Repository URL**
   - Paste any public GitHub repository URL (e.g., `https://github.com/facebook/react`)
   - The URL must be in the format: `https://github.com/owner/repository`

3. **Analyze**
   - Click the "Analyze Repository" button
   - Wait for the AI to analyze the repository (usually takes 5-15 seconds)

4. **View Results**
   - **Repository Info**: Basic stats including stars, forks, and primary language
   - **Summary**: A comprehensive 3-4 paragraph analysis of the project
   - **Fun Facts**: Five interesting insights about the repository

## Features

### What Gets Analyzed
- Repository metadata (name, description, stars, forks, etc.)
- README content (first 3000 characters)
- Programming languages used
- Project activity and health indicators

### AI-Powered Insights
- Project purpose and main features
- Technologies and approaches used
- Target audience and use cases
- Interesting statistics and patterns
- Notable achievements and milestones

## Fallback Mode

If the OpenAI API is unavailable (due to quota limits, rate limiting, or configuration issues), the application will **automatically switch to fallback mode**. This mode provides:

- ✅ Basic repository analysis using GitHub data
- ✅ Essential statistics and metrics
- ✅ Fun facts based on repository information
- ⚠️ A warning banner explaining why AI analysis is unavailable

**Fallback mode ensures the feature remains functional even without OpenAI access!**

## Troubleshooting

### OpenAI Quota Exceeded (429 Error)
If you see a yellow warning banner saying "AI Analysis Unavailable":
- **Your OpenAI account has exceeded its quota** or run out of credits
- Check your usage and billing: https://platform.openai.com/account/billing
- Add credits to your OpenAI account or wait for your quota to reset
- **The app will still work** in fallback mode with basic analysis

### "OpenAI API key not configured" Error
- Make sure you've created the `.env.local` file
- Verify the API key is correct (starts with `sk-`)
- Restart the development server after adding the environment variable
- **The app will work in fallback mode** if no API key is configured

### "Repository not found" Error
- Check that the URL is correct and the repository is public
- Ensure the URL format is: `https://github.com/owner/repo`
- Private repositories are not accessible without authentication

### Rate Limiting
- **GitHub API**: 60 requests/hour for unauthenticated requests
- **OpenAI API**: Varies by account tier and quota
- If you hit limits, wait a few minutes before trying again
- The app will use fallback mode if OpenAI limits are exceeded

## Technical Details

### Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4o-mini via LangChain
- **API**: GitHub REST API v3

### API Endpoint
- **Route**: `/api/analyze-repo`
- **Method**: POST
- **Body**: `{ "repoUrl": "https://github.com/owner/repo" }`

### Dependencies
- `@langchain/openai`: OpenAI integration
- `@langchain/core`: LangChain core functionality
- `langchain`: Main LangChain library

## Example Repositories to Try

- https://github.com/facebook/react
- https://github.com/microsoft/vscode
- https://github.com/vercel/next.js
- https://github.com/nodejs/node
- https://github.com/tensorflow/tensorflow

Enjoy exploring GitHub repositories with AI-powered insights! 🚀

