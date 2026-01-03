"use client";

import { useState } from "react";
import { ApiKey, maskKey, formatDate } from "./utils";

// ============== Modals ==============

interface CreateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, usageLimit: number) => Promise<void>;
}

const LIMIT_PRESETS = [100, 500, 1000, 5000, 10000];

export function CreateKeyModal({ isOpen, onClose, onCreate }: CreateKeyModalProps) {
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyLimit, setNewKeyLimit] = useState<number>(1000);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setIsCreating(true);
    try {
      await onCreate(newKeyName, newKeyLimit);
      setNewKeyName("");
      setNewKeyLimit(1000);
      onClose();
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setNewKeyName("");
    setNewKeyLimit(1000);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-lg font-semibold mb-4">Create New API Key</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Key Name</label>
            <input
              type="text"
              placeholder="e.g., Production, Development"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              autoFocus
              disabled={isCreating}
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Monthly Usage Limit</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={newKeyLimit}
                onChange={(e) => setNewKeyLimit(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                disabled={isCreating}
              />
              <span className="text-zinc-500 text-sm">requests</span>
            </div>
            <div className="flex gap-2 mt-2">
              {LIMIT_PRESETS.map((limit) => (
                <button
                  key={limit}
                  type="button"
                  onClick={() => setNewKeyLimit(limit)}
                  disabled={isCreating}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                    newKeyLimit === limit
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {limit.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleClose} disabled={isCreating} className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={!newKeyName.trim() || isCreating} className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Delete API Key</h2>
        </div>
        <p className="text-zinc-400 mb-6">
          Are you sure you want to delete this key? This action cannot be undone and any applications using this key will stop working.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-400 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ============== API Key Card ==============

interface ApiKeyCardProps {
  apiKey: ApiKey;
  isRevealed: boolean;
  isCopied: boolean;
  onToggleReveal: () => void;
  onCopy: () => void;
  onEdit: (name: string) => void;
  onDelete: () => void;
  onSimulateUsage: () => void;
}

export function ApiKeyCard({
  apiKey, isRevealed, isCopied,
  onToggleReveal, onCopy, onEdit, onDelete, onSimulateUsage,
}: ApiKeyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const handleStartEdit = () => {
    setEditName(apiKey.name);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) onEdit(editName.trim());
    setIsEditing(false);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName("");
  };

  return (
    <div className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                className="px-3 py-1.5 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                autoFocus
              />
              <button onClick={handleSaveEdit} className="p-1.5 text-emerald-400 hover:text-emerald-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
              <button onClick={handleCancelEdit} className="p-1.5 text-zinc-400 hover:text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          ) : (
            <h3 className="font-semibold text-white">{apiKey.name}</h3>
          )}
          
          <div className="flex items-center gap-3 mt-3">
            <code className="flex-1 px-3 py-2 bg-zinc-800/70 rounded-lg text-sm font-mono text-zinc-300 border border-zinc-700/50 truncate">
              {isRevealed ? apiKey.key : maskKey(apiKey.key)}
            </code>
            <button onClick={onToggleReveal} className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all" title={isRevealed ? "Hide key" : "Reveal key"}>
              {isRevealed ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
            <button onClick={onCopy} className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all" title="Copy to clipboard">
              {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              )}
            </button>
            <button onClick={handleStartEdit} className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all" title="Edit name">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Created {formatDate(apiKey.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <span className={apiKey.usage > 0 ? "text-emerald-400" : ""}>
                {apiKey.usage.toLocaleString()} request{apiKey.usage !== 1 ? "s" : ""}
              </span>
            </span>
          </div>
          
          {/* Usage bar */}
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500">Usage this month</span>
              <button onClick={onSimulateUsage} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                + Simulate request
              </button>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  apiKey.usage >= apiKey.usageLimit 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                    : apiKey.usage >= apiKey.usageLimit * 0.8
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${Math.min((apiKey.usage / apiKey.usageLimit) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-zinc-600">
              <span className={apiKey.usage >= apiKey.usageLimit ? 'text-red-400' : ''}>
                {apiKey.usage.toLocaleString()}
              </span>
              <span>{apiKey.usageLimit.toLocaleString()} limit</span>
            </div>
          </div>
        </div>
        
        <button onClick={onDelete} className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete key">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============== State Components ==============

export function LoadingState() {
  return (
    <div className="text-center py-20">
      <div className="w-12 h-12 mx-auto mb-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-zinc-500">Loading API keys...</p>
    </div>
  );
}

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-zinc-300 mb-2">No API keys yet</h3>
      <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
        Create your first API key to start integrating with your applications.
      </p>
      <button onClick={onCreateClick} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-white hover:bg-zinc-700 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14"/><path d="M5 12h14"/>
        </svg>
        Create your first key
      </button>
    </div>
  );
}

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 flex-shrink-0">
        <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
      </svg>
      <p className="text-sm text-red-400">{message}</p>
      <button onClick={onDismiss} className="ml-auto text-red-400 hover:text-red-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
  );
}

export function SecurityNotice() {
  return (
    <div className="mt-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
      <div className="flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 flex-shrink-0 mt-0.5">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <path d="M12 9v4"/><path d="M12 17h.01"/>
        </svg>
        <div className="text-sm">
          <p className="font-medium text-amber-500">Keep your API keys secure</p>
          <p className="text-zinc-400 mt-1">
            Never share your API keys publicly or commit them to version control. Rotate keys periodically and delete any keys that are no longer in use.
          </p>
        </div>
      </div>
    </div>
  );
}

