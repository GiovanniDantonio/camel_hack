'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';

type User = {
  email?: string | null;
  id?: string;
  user_metadata?: {
    avatar_url?: string;
  };
};

type GithubProfile = Database['public']['Tables']['github_profiles']['Row'];

type AuthContextType = {
  user: User | null;
  githubProfile: GithubProfile | null;
  loading: boolean;
  isLoadingGithubProfile: boolean;
  signOut: () => Promise<void>;
  refreshGithubProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  githubProfile: null,
  loading: true,
  isLoadingGithubProfile: false,
  signOut: async () => {},
  refreshGithubProfile: async () => {},
});

export function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [githubProfile, setGithubProfile] = useState<GithubProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isLoadingGithubProfile, setIsLoadingGithubProfile] = useState(false);

  // Create client-side Supabase client
  const supabase = createClient();

  const refreshGithubProfile = async () => {
    if (!user) return;
    setIsLoadingGithubProfile(true);

    try {
      // Query the GitHub profile from the database
      const { data, error } = await supabase
        .from('github_profiles')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching GitHub profile:', error);
        return;
      }

      console.log('GitHub profile:', data);

      if (data) {
        setGithubProfile(data);
      } else {
        // If no profile found, keep as null
        setGithubProfile(null);
      }
    } catch (error) {
      console.error('Error refreshing GitHub profile:', error);
    } finally {
      setIsLoadingGithubProfile(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshGithubProfile();
    }
  }, [user]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setGithubProfile(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          console.log('user', user);
          setUser({
            email: user.email,
            id: user.id,
            user_metadata: user.user_metadata,
          });

          // Load GitHub profile after user is set
          refreshGithubProfile();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setUser({
            email: session.user.email,
            id: session.user.id,
            user_metadata: {
              avatar_url: session.user.user_metadata?.avatar_url,
            },
          });
        } else {
          setUser(null);
          setGithubProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        githubProfile,
        loading,
        isLoadingGithubProfile,
        signOut,
        refreshGithubProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
