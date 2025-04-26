import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createClient } from '@/lib/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AttackComponentProps {
  projectId: string;
  vulnerabilityId: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  redirectPath?: string;
}

interface Attack {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'canceled';
  current_stage: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

interface AttackLog {
  id: string;
  attack_id: string;
  message: string;
  stage: string | null;
  created_at: string;
}

export function AttackComponent({
  projectId,
  vulnerabilityId,
  variant = 'default',
  size = 'default',
  className = '',
  redirectPath,
}: AttackComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [attackId, setAttackId] = useState<string | null>(null);
  const [attack, setAttack] = useState<Attack | null>(null);
  const [attackLogs, setAttackLogs] = useState<AttackLog[]>([]);
  const [showCard, setShowCard] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // 1. Check for the latest attack on mount
  useEffect(() => {
    const checkLatestAttack = async () => {
      console.log(
        'Checking for latest attack for vulnerability:',
        vulnerabilityId
      );
      const { data, error } = await supabase
        .from('attacks')
        .select('*')
        .eq('vulnerability_id', vulnerabilityId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking for latest attack:', error);
        return;
      }

      if (data && data.length > 0) {
        const latestAttack = data[0];
        console.log(
          'Found latest attack:',
          latestAttack.id,
          latestAttack.status
        );
        setAttackId(latestAttack.id); // Trigger the subscription useEffect
        setShowCard(true); // Show card if any attack exists
      } else {
        console.log('No attack found for this vulnerability.');
        // If no attack found, ensure UI is reset
        setAttackId(null);
        setAttack(null);
        setAttackLogs([]);
        setShowCard(false);
      }
    };

    checkLatestAttack();
    // Intentionally only run on mount for the specific vulnerability
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vulnerabilityId]);

  // 2. Fetch data and subscribe when attackId is set
  useEffect(() => {
    if (!attackId) {
      console.log('attackId is null, skipping fetch and subscription.');
      // Ensure cleanup if attackId becomes null
      setAttack(null);
      setAttackLogs([]);
      setShowCard(false);
      return;
    }

    console.log(
      `attackId is set to ${attackId}. Fetching data and subscribing.`
    );
    setShowCard(true); // Always show card when there's an attackId

    let isMounted = true; // Flag to prevent state updates on unmounted component
    let attackSubscription: any;
    let logsSubscription: any;

    const fetchInitialDataAndSubscribe = async () => {
      try {
        // Fetch initial attack state
        console.log(`Fetching initial state for attack ${attackId}...`);
        const { data: initialAttack, error: attackError } = await supabase
          .from('attacks')
          .select('*')
          .eq('id', attackId)
          .single();

        if (attackError) throw attackError;
        if (!isMounted) return;
        if (initialAttack) {
          console.log('Fetched initial attack state:', initialAttack);
          setAttack(initialAttack);
        } else {
          console.warn(
            `Attack with ID ${attackId} not found during initial fetch.`
          );
          // Optionally reset state if attack disappears
          setAttackId(null);
          return;
        }

        // Fetch initial logs
        console.log(`Fetching initial logs for attack ${attackId}...`);
        const { data: initialLogs, error: logsError } = await supabase
          .from('attack_logs')
          .select('*')
          .eq('attack_id', attackId)
          .order('created_at', { ascending: true });

        if (logsError) throw logsError;
        if (!isMounted) return;
        console.log('Fetched initial logs:', initialLogs?.length || 0);
        setAttackLogs(initialLogs || []);

        // Setup subscriptions only after initial data is fetched
        console.log(`Setting up subscriptions for attack ${attackId}...`);
        attackSubscription = supabase
          .channel(`attack-${attackId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'attacks',
              filter: `id=eq.${attackId}`,
            },
            (payload) => {
              if (!isMounted) return;
              const updatedAttack = payload.new as Attack;
              console.log('Received attack update:', updatedAttack);
              setAttack(updatedAttack);
              if (
                ['completed', 'failed', 'canceled'].includes(
                  updatedAttack.status
                )
              ) {
                console.log(
                  `Attack ${attackId} finished with status: ${updatedAttack.status}. Will hide card soon.`
                );
                // Optionally add a delay before hiding
                // setTimeout(() => {
                //   if (isMounted) {
                //      setAttackId(null); // This will trigger cleanup
                //   }
                // }, 5000);
              }
            }
          )
          .subscribe((status, err) => {
            if (err) {
              console.error(`Subscription error for attack-${attackId}:`, err);
            } else {
              console.log(
                `Subscription status for attack-${attackId}: ${status}`
              );
            }
          });

        logsSubscription = supabase
          .channel(`attack-logs-${attackId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'attack_logs',
              filter: `attack_id=eq.${attackId}`,
            },
            (payload) => {
              if (!isMounted) return;
              const newLog = payload.new as AttackLog;
              console.log('Received new log:', newLog);
              setAttackLogs((prevLogs) => [...prevLogs, newLog]);
            }
          )
          .subscribe((status, err) => {
            if (err) {
              console.error(
                `Subscription error for attack-logs-${attackId}:`,
                err
              );
            } else {
              console.log(
                `Subscription status for attack-logs-${attackId}: ${status}`
              );
            }
          });
      } catch (error) {
        console.error(
          `Error fetching initial data or subscribing for attack ${attackId}:`,
          error
        );
        if (!isMounted) return;
        toast.error('Failed to load attack details.');
        // Optionally reset state on error
        setAttackId(null);
      }
    };

    fetchInitialDataAndSubscribe();

    // Cleanup function
    return () => {
      isMounted = false; // Set flag on unmount
      console.log(`Cleaning up subscriptions for attack ${attackId}...`);
      if (attackSubscription) {
        supabase.removeChannel(attackSubscription);
        console.log(`Removed channel attack-${attackId}`);
      }
      if (logsSubscription) {
        supabase.removeChannel(logsSubscription);
        console.log(`Removed channel attack-logs-${attackId}`);
      }
    };
  }, [attackId, supabase]); // Rerun when attackId changes

  // 3. Handle Run Attack click
  const handleRunAttack = async () => {
    console.log('handleRunAttack called');
    setIsLoading(true);
    // Reset previous state if any, except attackId which will be set by the API call effect
    // setAttack(null);
    // setAttackLogs([]);
    // setShowCard(false);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/vulnerabilities/${vulnerabilityId}/attack`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start attack');
      }

      const data = await response.json();
      if (data.success && data.attackId) {
        console.log(
          'Attack started successfully via API. New attackId:',
          data.attackId
        );
        setAttackId(data.attackId); // This triggers the useEffect hook above
        // setShowCard(true); // Show card is handled by the useEffect now
        toast.success('Attack started successfully');
      } else {
        throw new Error(
          data.error || 'Invalid response from server when starting attack'
        );
      }
    } catch (error) {
      console.error('Error starting attack:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to start attack'
      );
      setAttackId(null); // Reset attackId on error
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Cancel Attack click
  const handleCancelAttack = async () => {
    if (!attackId) return;
    console.log(`Cancelling attack ${attackId}...`);
    setIsLoading(true);
    setShowCancelDialog(false); // Close dialog immediately

    try {
      const response = await fetch(
        `/api/projects/${projectId}/vulnerabilities/${vulnerabilityId}/attack/${attackId}/cancel`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel attack');
      }

      const data = await response.json();
      if (data.success) {
        console.log(`Attack ${attackId} cancel request successful.`);
        toast.success('Attack cancel request sent.');
        // State update (to canceled) will be handled by the subscription
        // No need to manually set attackId to null here, let the subscription handle final state
      } else {
        throw new Error(data.error || 'Failed to cancel attack via API');
      }
    } catch (error) {
      console.error('Error canceling attack:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel attack'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Determine button visibility based on attack state
  const canRunAttack =
    !attack || ['completed', 'failed', 'canceled'].includes(attack.status);
  const canCancelAttack =
    attack && ['pending', 'running'].includes(attack.status);

  // Debugging logs
  // console.log('[Render] attackId:', attackId);
  // console.log('[Render] attack:', attack);
  // console.log('[Render] showCard:', showCard);
  // console.log('[Render] canRun:', canRunAttack, 'canCancel:', canCancelAttack);

  return (
    <div className="space-y-4">
      {canRunAttack && (
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleRunAttack}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Run Attack
        </Button>
      )}

      {canCancelAttack && (
        <Button
          variant="destructive"
          size={size}
          className={className}
          onClick={() => setShowCancelDialog(true)}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Cancel Attack
        </Button>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Attack</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this attack? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, continue</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelAttack}>
              Yes, cancel attack
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Progress Card - controlled by showCard state, which is tied to attackId */}
      {showCard && attack && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Attack Progress (ID: {attack.id.substring(0, 8)})
            </CardTitle>
            <CardDescription>
              Status: {attack.status} | Stage: {attack.current_stage} |
              Progress: {attack.progress_percentage}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary rounded-full h-2.5 mb-4">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${attack.progress_percentage}%` }}
              ></div>
            </div>

            {/* Terminal Window for Attack Logs */}
            <div className="mt-6 border border-muted-foreground/20 rounded-md overflow-hidden">
              <div className="bg-zinc-900 border-b border-zinc-700 py-2 px-4">
                <h3 className="text-sm text-zinc-400 font-medium">
                  Attack Logs
                </h3>
              </div>
              <ScrollArea className="h-[400px] w-full">
                <div className="p-4 font-mono text-xs text-green-400 bg-black">
                  {attackLogs.length > 0 ? (
                    <pre className="whitespace-pre-wrap break-words">
                      {attackLogs.map((log) => (
                        <div key={log.id}>
                          <span className="text-gray-500">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </span>{' '}
                          -{' '}
                          <span
                            className={
                              log.stage === 'failed' ||
                              log.message.toLowerCase().includes('error')
                                ? 'text-red-400'
                                : 'text-green-400'
                            }
                          >
                            {log.message}
                          </span>
                        </div>
                      ))}
                    </pre>
                  ) : (
                    <div className="text-zinc-500">Waiting for logs...</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
