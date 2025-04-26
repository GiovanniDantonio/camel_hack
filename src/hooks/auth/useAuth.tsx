'use client';

import { createClient } from '@/lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(redirectTo = '/login'): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setIsLoading(true);

      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        router.push(redirectTo);
      }

      setIsLoading(false);
    });

    // Load initial session
    const loadInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error getting auth session:', error.message);
          throw error;
        }

        if (data?.user) {
          setUser(data.user);
        } else {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('Auth session error:', error);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialSession();

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [redirectTo, router, supabase]);

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, session, isLoading, signOut };
}
