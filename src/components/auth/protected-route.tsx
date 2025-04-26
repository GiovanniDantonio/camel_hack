'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64 mt-1" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // If we get here, the user is authenticated
  return <>{children}</>;
}
