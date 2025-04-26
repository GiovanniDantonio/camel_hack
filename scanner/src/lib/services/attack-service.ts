import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type Attack = Database['public']['Tables']['attacks']['Row'];
type AttackInsert = Database['public']['Tables']['attacks']['Insert'];
type AttackStatus = Database['public']['Enums']['attack_status'];
type AttackType = Database['public']['Enums']['attack_type'];

const stringToUUID = (str: string): string => {
  // Simple UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const fetchAttacks = async (): Promise<Attack[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('attacks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching attacks:', error);
    throw error;
  }

  return data || [];
};

export const fetchAttacksByProjectId = async (projectId: string): Promise<Attack[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('attacks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching attacks by project ID:', error);
    throw error;
  }

  return data || [];
};

export const fetchAttackById = async (id: string): Promise<Attack | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('attacks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching attack by ID:', error);
    throw error;
  }

  return data;
};

export const createAttack = async (attack: Omit<AttackInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Attack> => {
  const supabase = createClient();
  const now = new Date().toISOString();
  
  const newAttack: AttackInsert = {
    ...attack,
    id: stringToUUID(attack.target_component),
    created_at: now,
    updated_at: now,
    status: 'pending' as AttackStatus,
  };

  const { data, error } = await supabase
    .from('attacks')
    .insert(newAttack)
    .select()
    .single();

  if (error) {
    console.error('Error creating attack:', error);
    throw error;
  }

  return data;
};

export const updateAttackStatus = async (id: string, status: AttackStatus): Promise<Attack> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('attacks')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating attack status:', error);
    throw error;
  }

  return data;
};

export const updateAttackResult = async (
  id: string, 
  result: { 
    execution_logs?: string | null;
    result_summary?: string | null;
  }
): Promise<Attack> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('attacks')
    .update({ 
      ...result,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating attack result:', error);
    throw error;
  }

  return data;
};
