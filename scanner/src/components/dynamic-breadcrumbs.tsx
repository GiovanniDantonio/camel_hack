'use client';

import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type BreadcrumbItem = {
  href: string;
  label: string;
  isLoading?: boolean;
};

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    async function fetchProjectNames() {
      const segments = pathname.split('/').filter(Boolean);
      const crumbs: BreadcrumbItem[] = [];

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const href = `/${segments.slice(0, i + 1).join('/')}`;

        // Check if this is a project ID (comes after "projects" segment)
        if (
          i > 0 &&
          segments[i - 1] === 'projects' &&
          segments[i].match(/^[0-9a-f-]+$/)
        ) {
          // This looks like a UUID, try to fetch the project name
          const projectId = segment;

          // Add a loading placeholder first
          crumbs.push({
            href,
            label: 'Loading...',
            isLoading: true,
          });

          try {
            const supabase = createClient();
            const { data, error } = await supabase
              .from('projects')
              .select('project_name')
              .eq('id', projectId)
              .single();

            if (error) throw error;

            // Update with the actual project name
            crumbs[crumbs.length - 1] = {
              href,
              label: data.project_name || projectId,
              isLoading: false,
            };
          } catch (error) {
            console.error('Error fetching project name:', error);
            crumbs[crumbs.length - 1] = {
              href,
              label: projectId,
              isLoading: false,
            };
          }
        } else {
          // Regular segment processing
          const label = segment
            .replace(/-/g, ' ') // Replace dashes with spaces
            .replace(/[_-]/g, ' ') // Replace underscores and dashes with spaces
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' ');

          crumbs.push({ href, label });
        }
      }

      setBreadcrumbs(crumbs);
    }

    fetchProjectNames();
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center">
        {/* Logo as the first breadcrumb item */}
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/projects"
            className="flex items-center gap-1.5"
          >
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-bold">0PenAI</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Only add separator before path items if there are path items */}
        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}

        {/* Path-based breadcrumb items */}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>
                  {crumb.isLoading ? (
                    <span className="animate-pulse">{crumb.label}</span>
                  ) : (
                    crumb.label
                  )}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>
                  {crumb.isLoading ? (
                    <span className="animate-pulse">{crumb.label}</span>
                  ) : (
                    crumb.label
                  )}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
