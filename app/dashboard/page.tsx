"use client";

import { useState } from "react";
import { useApiKeys, useToast } from "./hooks";
import { Sidebar } from "./sidebar";
import { ToastNotification } from "./notifications";
import {
  CreateKeyModal,
  DeleteConfirmModal,
  ApiKeyCard,
  LoadingState,
  EmptyState,
  ErrorBanner,
  SecurityNotice,
} from "./apikeyoperations";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const { toast, showToast, hideToast } = useToast();
  const { apiKeys, isLoading, error, setError, createKey, updateKeyName, deleteKey, simulateUsage } = useApiKeys();

  const handleCreate = async (name: string, usageLimit: number) => {
    const newKey = await createKey(name, usageLimit);
    if (newKey) {
      setRevealedKeys(new Set([...revealedKeys, newKey.id]));
      showToast('API key created successfully!', 'success');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const success = await deleteKey(deleteConfirmId);
    if (success) {
      showToast('API key deleted successfully', 'info');
    }
    setDeleteConfirmId(null);
  };

  const handleUpdateName = async (id: string, name: string) => {
    const success = await updateKeyName(id, name);
    if (success) {
      showToast('API key name updated successfully', 'success');
    }
  };

  const copyToClipboard = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    showToast('API key copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    const newSet = new Set(revealedKeys);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setRevealedKeys(newSet);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] pointer-events-none" />

      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="relative max-w-5xl mx-auto px-8 py-10">
          {/* Overview Section - API Keys CRUD */}
          {activeSection === 'overview' && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      API Keys
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                      {apiKeys.length}
                    </span>
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1">Manage your API keys for authentication</p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14"/><path d="M5 12h14"/>
                  </svg>
                  Create Key
                </button>
              </div>

              {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

              <CreateKeyModal
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                onCreate={handleCreate}
              />

              <DeleteConfirmModal
                isOpen={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={handleDelete}
              />

              {/* Content */}
              {isLoading ? (
                <LoadingState />
              ) : apiKeys.length === 0 ? (
                <EmptyState onCreateClick={() => setIsCreating(true)} />
              ) : (
                <div className="space-y-3">
                  {apiKeys.map((apiKey) => (
                    <ApiKeyCard
                      key={apiKey.id}
                      apiKey={apiKey}
                      isRevealed={revealedKeys.has(apiKey.id)}
                      isCopied={copiedId === apiKey.id}
                      onToggleReveal={() => toggleReveal(apiKey.id)}
                      onCopy={() => copyToClipboard(apiKey.key, apiKey.id)}
                      onEdit={(name) => handleUpdateName(apiKey.id, name)}
                      onDelete={() => setDeleteConfirmId(apiKey.id)}
                      onSimulateUsage={() => simulateUsage(apiKey.id)}
                    />
                  ))}
                </div>
              )}

              <SecurityNotice />
            </>
          )}

          {/* Other Sections Placeholder */}
          {activeSection === 'research-assistant' && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Research Assistant
                </span>
              </h1>
              <p className="text-sm text-zinc-500 mb-8">AI-powered research assistance</p>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  </svg>
                </div>
                <p className="text-zinc-400">Research Assistant coming soon</p>
              </div>
            </div>
          )}

          {activeSection === 'research-reports' && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Research Reports
                </span>
              </h1>
              <p className="text-sm text-zinc-500 mb-8">View and manage your research reports</p>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <p className="text-zinc-400">No reports yet</p>
              </div>
            </div>
          )}

          {activeSection === 'invoices' && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Invoices
                </span>
              </h1>
              <p className="text-sm text-zinc-500 mb-8">Billing and payment history</p>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  </svg>
                </div>
                <p className="text-zinc-400">No invoices yet</p>
              </div>
            </div>
          )}

          {activeSection === 'documentation' && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Documentation
                </span>
              </h1>
              <p className="text-sm text-zinc-500 mb-8">API documentation and guides</p>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <p className="text-zinc-400">Documentation coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <ToastNotification toast={toast} onClose={hideToast} />}
    </div>
  );
}
