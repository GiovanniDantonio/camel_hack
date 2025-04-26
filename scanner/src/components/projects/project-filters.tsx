'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ProjectFilters {
  search: string;
  status: 'all' | 'vulnerable' | 'secure';
  sortBy: 'name' | 'updated' | 'vulnerabilities';
  sortOrder: 'asc' | 'desc';
}

interface ProjectFiltersProps {
  onFiltersChange: (filters: ProjectFilters) => void;
  className?: string;
}

export function ProjectFilters({
  onFiltersChange,
  className,
}: ProjectFiltersProps) {
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    status: 'all',
    sortBy: 'updated',
    sortOrder: 'desc',
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFiltersChange]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleStatusChange = (value: 'all' | 'vulnerable' | 'secure') => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const handleSortByChange = (
    value: 'name' | 'updated' | 'vulnerabilities'
  ) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setFilters((prev) => ({ ...prev, sortOrder: value }));
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="vulnerable">Vulnerable</SelectItem>
              <SelectItem value="secure">Secure</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="vulnerabilities">Vulnerabilities</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              handleSortOrderChange(
                filters.sortOrder === 'asc' ? 'desc' : 'asc'
              )
            }
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.search && (
          <Badge variant="secondary" className="gap-1">
            Search: {filters.search}
            <button
              onClick={() => handleSearchChange('')}
              className="ml-1 hover:text-destructive"
            >
              ×
            </button>
          </Badge>
        )}
        {filters.status !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            Status: {filters.status}
            <button
              onClick={() => handleStatusChange('all')}
              className="ml-1 hover:text-destructive"
            >
              ×
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
}
