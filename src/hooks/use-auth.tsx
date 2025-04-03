import { ReactNode, createContext, useContext } from 'react';
import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query';
import type { SelectUser } from '@/types/schema'; // Updated import path
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

type LoginData = {
  username: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const {
    data: user,
    error,
    isLoading
  } = useQuery<SelectUser | null>({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const res = await fetch('/api/user');
      if (res.status === 401) return null;
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!res.ok) throw new Error('Invalid credentials');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Logged in successfully',
        description: 'Welcome back!'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to logout');
    },
    onSuccess: () => {
      toast({
        title: 'Logged out successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
