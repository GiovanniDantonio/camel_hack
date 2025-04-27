'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type GitHubProfile = Database['public']['Tables']['github_profiles']['Row'];

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  githubProfile: GitHubProfile | null;
  isLoadingGithubProfile: boolean;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshGithubProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(
    null
  );
  const [isLoadingGithubProfile, setIsLoadingGithubProfile] = useState(false);

  const fetchGithubProfile = async (userId: string) => {
    if (!userId) return;

    setIsLoadingGithubProfile(true);
    try {
      console.log('Fetching GitHub profile via API endpoint for user:', userId);

      // Use the server-side API endpoint instead of direct Supabase client
      const response = await fetch('/api/profile/github');

      if (!response.ok) {
        // Handle error responses from the API
        const errorData = await response.json().catch(() => ({}));
        console.error('Error fetching GitHub profile:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error || 'Unknown error',
        });

        // Not found is expected for new users
        if (response.status === 404) {
          console.log(
            'No GitHub profile found for user - this is normal for new users'
          );
          setGithubProfile(null);
        }
        return;
      }

      // Handle successful response
      const data = await response.json();
      console.log('Successfully fetched GitHub profile');
      setGithubProfile(data.githubProfile);
    } catch (error) {
      console.error('Error in fetchGithubProfile:', error);
    } finally {
      setIsLoadingGithubProfile(false);
    }
  };

  const refreshGithubProfile = async () => {
    if (user?.id) {
      await fetchGithubProfile(user.id);
    }
  };

  useEffect(() => {
    // Ensure this runs only in the browser environment
    if (typeof window === 'undefined') return;

    const supabase = createClient();

    // Check for active session on initial load
    const getInitialSession = async () => {
      setIsLoading(true);

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        setUser(user);

        // Fetch GitHub profile if user is authenticated
        if (user) {
          await fetchGithubProfile(user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch GitHub profile when user signs in
      if (session?.user) {
        await fetchGithubProfile(session.user.id);
      } else {
        setGithubProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGitHub = async () => {
    try {
      // Use the route handler instead of direct Supabase client call
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to start GitHub authentication'
        );
      }

      const data = await response.json();

      // Redirect the user to the GitHub OAuth URL
      window.location.href = data.url;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    isLoading,
    githubProfile,
    isLoadingGithubProfile,
    signInWithGitHub,
    signOut,
    refreshGithubProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
