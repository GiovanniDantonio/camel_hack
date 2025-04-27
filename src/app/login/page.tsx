'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, Shield, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);

      // Call the server-side signin API route
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectTo: '/projects',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      // Redirect to the GitHub auth URL provided by the server
      window.location.href = data.url;
    } catch (error) {
      console.error('Error signing in:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-background/10 via-background/50 to-background/80" />

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-2">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">PenOpenAI</h1>
          <p className="text-sm text-muted-foreground">
            Secure your code with AI-powered vulnerability scanning
          </p>
        </div>

        <Card className="border-muted/40 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold">
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in to continue to your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <Button
              className="relative flex w-full items-center justify-center gap-2"
              variant="outline"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              <span>
                {isLoading ? 'Signing in...' : 'Continue with GitHub'}
              </span>
            </Button>

            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Secure authentication</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col border-t bg-muted/40 px-6 py-4">
            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our{' '}
              <Link
                href="#"
                className="underline underline-offset-2 hover:text-primary"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="#"
                className="underline underline-offset-2 hover:text-primary"
              >
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
