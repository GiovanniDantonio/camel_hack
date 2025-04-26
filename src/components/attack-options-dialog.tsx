'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

const ATTACK_TYPES = [
  'sql_injection',
  'xss',
  'csrf',
  'rce',
  'ssrf',
  'other',
] as const;

const TARGET_COMPONENTS = [
  'login',
  'signup',
  'profile',
  'dashboard',
  'api',
  'database',
] as const;

interface AttackOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (options: {
    attackType: (typeof ATTACK_TYPES)[number];
    targetComponent: (typeof TARGET_COMPONENTS)[number];
    parameters: {
      method: string;
      headers: Record<string, string>;
      payload: Record<string, unknown>;
    };
  }) => Promise<void>;
  isLoading?: boolean;
}

export function AttackOptionsDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: AttackOptionsDialogProps) {
  const [attackType, setAttackType] =
    useState<(typeof ATTACK_TYPES)[number]>('sql_injection');
  const [targetComponent, setTargetComponent] =
    useState<(typeof TARGET_COMPONENTS)[number]>('login');
  const [method, setMethod] = useState('POST');
  const [payload, setPayload] = useState('{\n  "test": "data"\n}');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let parsedPayload: Record<string, unknown>;
    try {
      parsedPayload = JSON.parse(payload);
    } catch (error) {
      alert('Invalid JSON payload');
      return;
    }

    await onSubmit({
      attackType,
      targetComponent,
      parameters: {
        method,
        headers: { 'Content-Type': 'application/json' },
        payload: parsedPayload,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Configure Attack</DialogTitle>
            <DialogDescription>
              Set up the parameters for your penetration test attack.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attack-type" className="text-right">
                Attack Type
              </Label>
              <Select
                value={attackType}
                onValueChange={(value: (typeof ATTACK_TYPES)[number]) =>
                  setAttackType(value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select attack type" />
                </SelectTrigger>
                <SelectContent>
                  {ATTACK_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target" className="text-right">
                Target
              </Label>
              <Select
                value={targetComponent}
                onValueChange={(value: (typeof TARGET_COMPONENTS)[number]) =>
                  setTargetComponent(value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select target component" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_COMPONENTS.map((component) => (
                    <SelectItem key={component} value={component}>
                      {component.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Method
              </Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select HTTP method" />
                </SelectTrigger>
                <SelectContent>
                  {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payload" className="text-right">
                Payload
              </Label>
              <textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="col-span-3 flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter JSON payload"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Run Attack
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
