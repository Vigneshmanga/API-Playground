"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, ApiKeyRow } from "@/lib/supabase";
import { ApiKey, Toast, ToastType, generateApiKey, rowToApiKey } from "./utils";

// ============== Toast Hook ==============

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}

// ============== API Keys Hook ==============

interface UseApiKeysReturn {
  apiKeys: ApiKey[];
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  createKey: (name: string, usageLimit: number) => Promise<ApiKey | null>;
  updateKeyName: (id: string, name: string) => Promise<boolean>;
  deleteKey: (id: string) => Promise<boolean>;
  simulateUsage: (id: string) => Promise<boolean>;
}

export function useApiKeys(): UseApiKeysReturn {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch API keys from Supabase
  const fetchApiKeys = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys((data || []).map(rowToApiKey));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch API keys');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  // Create a new API key
  const createKey = useCallback(async (name: string, usageLimit: number): Promise<ApiKey | null> => {
    if (!name.trim()) return null;
    
    try {
      setError(null);
      const newKey = {
        id: crypto.randomUUID(),
        name: name.trim(),
        value: generateApiKey(),
        created_at: new Date().toISOString(),
        usage: 0,
        usage_limit: usageLimit,
      };

      const { error } = await supabase.from('api_keys').insert(newKey);

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(error.message || 'Failed to create API key');
      }

      const createdKey = rowToApiKey(newKey as ApiKeyRow);
      setApiKeys(prev => [createdKey, ...prev]);
      return createdKey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key');
      return null;
    }
  }, []);

  // Update API key name
  const updateKeyName = useCallback(async (id: string, name: string): Promise<boolean> => {
    if (!name.trim()) return false;

    try {
      setError(null);
      const { error } = await supabase
        .from('api_keys')
        .update({ name: name.trim() })
        .eq('id', id);

      if (error) throw error;

      setApiKeys(prev => prev.map((k) => (k.id === id ? { ...k, name: name.trim() } : k)));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update API key');
      return false;
    }
  }, []);

  // Delete an API key
  const deleteKey = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const { error } = await supabase.from('api_keys').delete().eq('id', id);

      if (error) throw error;

      setApiKeys(prev => prev.filter((k) => k.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API key');
      return false;
    }
  }, []);

  // Simulate usage (increment usage count)
  const simulateUsage = useCallback(async (id: string): Promise<boolean> => {
    const key = apiKeys.find(k => k.id === id);
    if (!key) return false;

    try {
      setError(null);
      const newUsage = key.usage + 1;

      const { error } = await supabase
        .from('api_keys')
        .update({ usage: newUsage })
        .eq('id', id);

      if (error) throw error;

      setApiKeys(prev => prev.map((k) => 
        k.id === id ? { ...k, usage: newUsage } : k
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update usage');
      return false;
    }
  }, [apiKeys]);

  return {
    apiKeys,
    isLoading,
    error,
    setError,
    createKey,
    updateKeyName,
    deleteKey,
    simulateUsage,
  };
}

