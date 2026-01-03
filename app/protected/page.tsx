"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProtectedPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [apiKeyName, setApiKeyName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user has a validated API key
    const validatedKey = sessionStorage.getItem('validated_api_key');
    const keyName = sessionStorage.getItem('api_key_name');
    
    if (!validatedKey) {
      // Not authorized, redirect to playground
      router.push('/playground');
    } else {
      setIsAuthorized(true);
      setApiKeyName(keyName || 'API Key');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('validated_api_key');
    sessionStorage.removeItem('api_key_name');
    router.push('/playground');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying access...
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg text-white">Nani</span>
              <span className="text-xs text-zinc-500 block">Protected Playground</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* API Key Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-400 font-medium">{apiKeyName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Welcome to the Protected Playground
                </span>
              </h1>
              <p className="text-zinc-400">
                You have successfully authenticated with a valid API key. Explore the API endpoints and test your integrations below.
              </p>
            </div>
          </div>
        </div>

        {/* API Endpoints Grid */}
        <h2 className="text-lg font-semibold text-white mb-4">Available Endpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {[
            { method: 'GET', endpoint: '/api/research', description: 'Fetch research data' },
            { method: 'POST', endpoint: '/api/analyze', description: 'Analyze content' },
            { method: 'GET', endpoint: '/api/reports', description: 'List all reports' },
            { method: 'POST', endpoint: '/api/generate', description: 'Generate new content' },
            { method: 'PUT', endpoint: '/api/update', description: 'Update resources' },
            { method: 'DELETE', endpoint: '/api/remove', description: 'Remove resources' },
          ].map((item, index) => (
            <div key={index} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  item.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                  item.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                  item.method === 'PUT' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {item.method}
                </span>
                <code className="text-sm text-zinc-300 font-mono">{item.endpoint}</code>
              </div>
              <p className="text-sm text-zinc-500">{item.description}</p>
            </div>
          ))}
        </div>

        {/* API Tester */}
        <h2 className="text-lg font-semibold text-white mb-4">Quick API Test</h2>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-4 mb-4">
            <select className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <input
              type="text"
              placeholder="Enter API endpoint..."
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
              Send Request
            </button>
          </div>
          
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <span className="text-zinc-600">//</span> Response will appear here
            </div>
            <pre className="text-zinc-400">
{`{
  "status": "ready",
  "message": "Select an endpoint and click Send Request"
}`}
            </pre>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-zinc-500">Requests Today</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-sm text-zinc-500">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">~50ms</p>
                <p className="text-sm text-zinc-500">Avg Response Time</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

