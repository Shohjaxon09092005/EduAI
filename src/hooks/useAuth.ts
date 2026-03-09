/**
 * useAuth hook for authentication management
 */
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';

export function useAuth() {
  const [isReady, setIsReady] = useState(false);

  // Initialize auth on mount
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await api.get('/auth/me/');
        return response.data;
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post('/auth/login/', credentials);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return response.data.user;
    },
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/';
  };

  return {
    user: user as User | null,
    isLoading: isLoading || !isReady,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout,
  };
}
