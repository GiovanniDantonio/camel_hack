'use client';

import { FolderGit2, ChevronUp, LogOut, Settings, Shield } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useAuth } from '@/components/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Menu items
const items = [
  {
    title: 'Projects',
    url: '/projects',
    icon: FolderGit2,
  },
];

export function AppSidebar() {
  const { user, githubProfile, signOut, loading, isLoadingGithubProfile } =
    useAuth();

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const isProfileLoading = loading || isLoadingGithubProfile;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-4 py-3">
          <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
          <h1 className="text-lg font-bold group-data-[collapsible=icon]:hidden">
            0PenAI
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <div className="flex items-center gap-2">
                    {isProfileLoading ? (
                      <>
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
                      </>
                    ) : (
                      <>
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={
                              githubProfile?.github_avatar_url ||
                              user?.user_metadata?.avatar_url ||
                              undefined
                            }
                          />
                          <AvatarFallback>
                            {githubProfile?.github_username
                              ? getInitials(githubProfile.github_username)
                              : user?.email
                              ? getInitials(user.email)
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="group-data-[collapsible=icon]:hidden flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                          {githubProfile?.github_username ||
                            user?.email ||
                            'Profile'}
                        </span>
                        <ChevronUp className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                      </>
                    )}
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <a
                    href="/profile"
                    className="flex items-center cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="flex items-center cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
