'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import ProtectedRoute from '@/components/auth/protected-route';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Github,
  Key,
  Loader2,
  LogOut,
  RefreshCw,
  Shield,
  User,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const {
    user,
    githubProfile,
    isLoading,
    isLoadingGithubProfile,
    refreshGithubProfile,
    signOut,
  } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    try {
      await refreshGithubProfile();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">
              Manage your account and connected services
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
            <Link href="/projects">
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Projects
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Basic details about your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={user?.user_metadata?.avatar_url || undefined}
                      />
                      <AvatarFallback>
                        {user?.email ? getInitials(user.email) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{user?.email}</h3>
                      <p className="text-sm text-muted-foreground">
                        User ID: {user?.id?.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Sign In</p>
                    <p className="text-sm">
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GitHub Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub Connection
                </CardTitle>
                <CardDescription>Your linked GitHub account</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingGithubProfile ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : !githubProfile ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">
                      No GitHub Account Connected
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md">
                      Please sign out and sign in again with GitHub to connect
                      your account.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={githubProfile.github_avatar_url || undefined}
                        />
                        <AvatarFallback>
                          {getInitials(githubProfile.github_username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">
                          {githubProfile.github_username}
                        </h3>
                        <div className="flex items-center mt-1">
                          <Link
                            href={`https://github.com/${githubProfile.github_username}`}
                            target="_blank"
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            <Github className="h-3 w-3 mr-1" />
                            View GitHub Profile
                          </Link>
                        </div>
                      </div>
                    </div>

                    {githubProfile.github_bio && (
                      <div className="pt-2">
                        <p className="text-sm font-medium">Bio</p>
                        <p className="text-sm">{githubProfile.github_bio}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium">Token Status</p>
                      <div className="flex items-center mt-1">
                        {githubProfile.github_access_token ? (
                          <Badge
                            variant="outline"
                            className="flex items-center bg-green-50"
                          >
                            <Key className="h-3 w-3 mr-1 text-green-600" />
                            <span className="text-green-600">Active Token</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="flex items-center bg-yellow-50"
                          >
                            <Key className="h-3 w-3 mr-1 text-yellow-600" />
                            <span className="text-yellow-600">No Token</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Connected Since</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            githubProfile.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {githubProfile && (
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshProfile}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Connection
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
