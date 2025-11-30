import type { AuthTokenResponsePassword } from '@supabase/supabase-js';
import React from 'react';
import { useSupabase } from '@/core/use-supabase.tsx';
import { useUserStore } from '@/stores/user-store';

type UserData = AuthTokenResponsePassword['data'];
type ErrorData = AuthTokenResponsePassword['error'];

export function useLogin(): {
  login: (username: string, password: string) => Promise<void>;
  data?: UserData;
  error?: ErrorData;
  loading: boolean;
} {
  const [data, setData] = React.useState<UserData>();
  const [error, setError] = React.useState<ErrorData>();
  const [loading, setLoading] = React.useState(false);

  const [_, setUser] = useUserStore();
  const supabase = useSupabase();

  const login = React.useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });
      setLoading(false);
      setData(data);
      setError(error);

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata.name ?? '',
          token: data.session?.access_token ?? '',
        });
      }
    },
    [supabase, setUser],
  );

  return {
    login,
    data,
    error,
    loading,
  };
}
