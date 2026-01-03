"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<ValidationStatus>('idle');
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const validateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) return;

    setStatus('validating');

    try {
      // Query Supabase to check if the API key exists
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, value')
        .eq('value', apiKey.trim())
        .single();

      if (error || !data) {
        setStatus('invalid');
        setShowPopup(true);
      } else {
        setStatus('valid');
        setShowPopup(true);
        // Store the validated API key in sessionStorage for the protected page
        sessionStorage.setItem('validated_api_key', apiKey.trim());
        sessionStorage.setItem('api_key_name', data.name);
        // Redirect after showing success popup
        setTimeout(() => {
          router.push('/protected');
        }, 1500);
      }
    } catch {
      setStatus('invalid');
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (status === 'invalid') {
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex flex-col">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg text-white">Nani</span>
              <span className="text-xs text-zinc-500 block">API Playground</span>
            </div>
          </Link>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl p-8 shadow-2xl">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                API Playground
              </span>
            </h1>
            <p className="text-sm text-zinc-500 text-center mb-8">
              Enter your API key to access the playground
            </p>

            {/* Form */}
            <form onSubmit={validateApiKey} className="space-y-6">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-zinc-300 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="nani-xxxxxxxx-xxxx-xxxx-xxxx"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono text-sm"
                    disabled={status === 'validating'}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!apiKey.trim() || status === 'validating'}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {status === 'validating' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Validate & Enter
                  </>
                )}
              </button>
            </form>

            {/* Help text */}
            <p className="text-xs text-zinc-600 text-center mt-6">
              Don&apos;t have an API key?{' '}
              <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Create one in the dashboard
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePopup}
          />
          
          {/* Modal */}
          <div className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200 ${
            status === 'valid' 
              ? 'bg-zinc-900 border-emerald-500/30' 
              : 'bg-zinc-900 border-red-500/30'
          }`}>
            {/* Icon */}
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              status === 'valid'
                ? 'bg-emerald-500/20'
                : 'bg-red-500/20'
            }`}>
              {status === 'valid' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              )}
            </div>

            {/* Content */}
            <h2 className={`text-xl font-bold text-center mb-2 ${
              status === 'valid' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {status === 'valid' ? 'Valid API Key!' : 'Invalid API Key'}
            </h2>
            <p className="text-sm text-zinc-400 text-center mb-6">
              {status === 'valid' 
                ? 'Redirecting you to the protected playground...'
                : 'The API key you entered is not valid. Please check and try again.'
              }
            </p>

            {/* Button */}
            {status === 'invalid' && (
              <button
                onClick={closePopup}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
              >
                Try Again
              </button>
            )}

            {status === 'valid' && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

