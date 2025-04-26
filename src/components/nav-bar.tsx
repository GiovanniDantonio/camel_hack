'use client';

import { LogOut, Settings, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/components/auth-provider';
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Extended User Metadata Type
interface UserMetadata {
  avatar_url?: string;
  full_name?: string;
  name?: string;
}

export function NavBar() {
  const { user, githubProfile, signOut, loading, isLoadingGithubProfile } =
    useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const isProfileLoading = loading || isLoadingGithubProfile;

  // Get user's name from metadata if available
  const userMetadata = user?.user_metadata as UserMetadata;
  const userName =
    userMetadata?.full_name ||
    userMetadata?.name ||
    githubProfile?.github_username ||
    user?.email ||
    'User';

  // Check if we're in a project page to show tabs
  const isProjectPage =
    pathname.startsWith('/projects/') &&
    pathname.split('/').length > 2 &&
    !pathname.includes('/new-project');

  const projectId = isProjectPage ? pathname.split('/')[2] : '';

  // Define project tabs if we're in a project page
  const projectTabs = [
    { name: 'Overview', href: `/projects/${projectId}`, exact: true },
    { name: 'Scans', href: `/projects/${projectId}/scans` },
    { name: 'Vulnerabilities', href: `/projects/${projectId}/vulnerabilities` },
    { name: 'Code', href: `/projects/${projectId}/code` },
    { name: 'Settings', href: `/projects/${projectId}/settings` },
  ];

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div
      className={cn(
        'sticky top-0 z-40 w-full backdrop-blur-sm transition-all duration-200',
        scrolled ? 'bg-background/95 shadow-sm' : 'bg-background'
      )}
    >
      <div className="flex h-12 items-center justify-between px-3 sm:px-4">
        <div className="flex items-center">
          <DynamicBreadcrumbs />
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-1.5 rounded-md hover:bg-accent"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full p-1 hover:bg-accent transition-colors"
                aria-label="User menu"
              >
                {isProfileLoading ? (
                  <Skeleton className="h-7 w-7 rounded-full" />
                ) : (
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={
                        githubProfile?.github_avatar_url ||
                        user?.user_metadata?.avatar_url ||
                        undefined
                      }
                      alt={userName}
                    />
                    <AvatarFallback>
                      {githubProfile?.github_username
                        ? getInitials(githubProfile.github_username)
                        : user?.email
                        ? getInitials(user.email)
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-2 py-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        githubProfile?.github_avatar_url ||
                        user?.user_metadata?.avatar_url ||
                        undefined
                      }
                      alt={userName}
                    />
                    <AvatarFallback>
                      {githubProfile?.github_username
                        ? getInitials(githubProfile.github_username)
                        : user?.email
                        ? getInitials(user.email)
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{userName}</span>
                    {githubProfile?.github_username && (
                      <span className="text-xs text-muted-foreground">
                        @{githubProfile.github_username}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="flex items-center cursor-pointer h-8"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="flex items-center cursor-pointer h-8"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t px-3 py-2 bg-background shadow-md">
          {isProjectPage && (
            <div className="space-y-0.5 mb-2">
              {projectTabs.map((tab) => {
                const isActive = tab.exact
                  ? pathname === tab.href
                  : pathname.startsWith(tab.href);

                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={cn(
                      'flex items-center px-2 py-1.5 text-sm rounded-md',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t">
            <div className="space-y-0.5">
              <div className="flex items-center px-2 py-1.5">
                <ThemeToggle />
                <span className="ml-2 text-sm">Theme</span>
              </div>
              <Link
                href="/profile"
                className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent"
              >
                <Settings className="h-3.5 w-3.5 mr-2" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project tabs - desktop */}
      {isProjectPage && !isMobileMenuOpen && (
        <div
          className={cn(
            'border-b hidden sm:block transition-all duration-200',
            scrolled ? 'border-muted/60' : ''
          )}
        >
          <div className="flex h-9 items-center space-x-1 px-3 sm:px-4 overflow-x-auto">
            {projectTabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href);

              return (
                <Button
                  key={tab.name}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 relative px-2.5 transition-all text-sm',
                    isActive
                      ? 'font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  asChild
                >
                  <Link href={tab.href}>
                    {tab.name}
                    {isActive && (
                      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary rounded-full" />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
