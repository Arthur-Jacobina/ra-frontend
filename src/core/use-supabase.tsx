import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type React from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useUserStore } from '@/stores/user-store';
import { isTokenAboutToExpire } from '@/utils/token.utils.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => {
    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  return <SupabaseContext.Provider value={client}>{children}</SupabaseContext.Provider>;
}

export function useSupabase(): SupabaseClient {
  const client = useContext(SupabaseContext);

  const [user, setUser] = useUserStore();

  if (!client) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: Don't need to refresh session on every render
  useEffect(() => {
    const refreshSession = async () => {
      const { data, error } = await client.auth.refreshSession({
        refresh_token: user?.token ?? '',
      });
      if (data && !error) {
        setUser({
          id: user?.id ?? '',
          email: user?.email ?? '',
          name: user?.name ?? '',
          token: data.session?.access_token ?? '',
        });
      }
    };
    if (isTokenAboutToExpire(user?.token)) {
      refreshSession();
    }
  }, []);

  return client;
}
