'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BranchSelectorProps {
  projectId: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function BranchSelector({
  projectId,
  value,
  onValueChange,
  className,
}: BranchSelectorProps) {
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/projects/${projectId}/branches`);

        if (!response.ok) {
          throw new Error('Failed to fetch branches');
        }

        const data = await response.json();
        setBranches(data.branches || ['main']);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch branches'
        );
        // Fallback to main branch if fetch fails
        setBranches(['main']);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchBranches();
    }
  }, [projectId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : value ? (
            value
          ) : (
            'Select branch...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search branches..." />
          <CommandEmpty>No branches found.</CommandEmpty>
          <CommandGroup>
            {branches.map((branch) => (
              <CommandItem
                key={branch}
                value={branch}
                onSelect={(currentValue) => {
                  onValueChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === branch ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {branch}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
