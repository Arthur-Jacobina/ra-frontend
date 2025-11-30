import type { AuthResponse } from '@supabase/supabase-js';
import React from 'react';
import { useSupabase } from '@/core/use-supabase.tsx';
import { useUserStore } from '@/stores/user-store';

type UserData = AuthResponse['data'];
type ErrorData = AuthResponse['error'];

export function useRegister(): {
  register: (email: string, password: string) => Promise<void>;
  data?: UserData;
  error?: ErrorData;
  loading: boolean;
} {
  const [data, setData] = React.useState<UserData>();
  const [error, setError] = React.useState<ErrorData>();
  const [loading, setLoading] = React.useState(false);

  const [_, setUser] = useUserStore();
  const supabase = useSupabase();

  const register = React.useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });
      setLoading(false);
      setData(data);
      setError(error);

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata.name ?? name,
          token: data.session?.access_token ?? '',
        });
      }
    },
    [supabase, setUser],
  );

  return {
    register,
    data,
    error,
    loading,
  };
}
