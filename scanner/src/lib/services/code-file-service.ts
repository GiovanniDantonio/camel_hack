import { supabase } from '@/lib/supabase';

export interface CodeFile {
  id: string;
  project_id: string;
  file_path: string;
  file_name: string;
  language: string;
  content: string;
  sha: string;
  created_at: string;
  updated_at: string;
  last_scanned_at: string;
}

export class CodeFileService {
  static async createCodeFile(
    data: Omit<CodeFile, 'id' | 'created_at' | 'updated_at' | 'last_scanned_at'>
  ): Promise<CodeFile> {
    try {
      const { data: codeFile, error } = await supabase
        .from('code_files')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_scanned_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating code file:', error);
        throw new Error('Failed to create code file');
      }

      return codeFile;
    } catch (error) {
      console.error('Error creating code file:', error);
      throw error;
    }
  }

  static async getCodeFilesByProjectId(projectId: string): Promise<CodeFile[]> {
    try {
      const { data, error } = await supabase
        .from('code_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching code files:', error);
        throw new Error('Failed to fetch code files');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching code files:', error);
      return []; // Return empty array instead of throwing to handle the case gracefully
    }
  }

  static async getCodeFileById(codeFileId: string): Promise<CodeFile | null> {
    try {
      const { data, error } = await supabase
        .from('code_files')
        .select('*')
        .eq('id', codeFileId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching code file:', error);
        throw new Error('Failed to fetch code file');
      }

      return data;
    } catch (error) {
      console.error('Error fetching code file:', error);
      return null; // Return null instead of throwing to handle the case gracefully
    }
  }

  static async updateCodeFile(
    id: string,
    updates: Partial<Omit<CodeFile, 'id' | 'project_id' | 'created_at'>>
  ): Promise<CodeFile> {
    try {
      const { data, error } = await supabase
        .from('code_files')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating code file:', error);
        throw new Error('Failed to update code file');
      }

      return data;
    } catch (error) {
      console.error('Error updating code file:', error);
      throw error;
    }
  }

  static async deleteCodeFile(codeFileId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('code_files')
        .delete()
        .eq('id', codeFileId);

      if (error) {
        console.error('Error deleting code file:', error);
        throw new Error('Failed to delete code file');
      }
    } catch (error) {
      console.error('Error deleting code file:', error);
      throw error;
    }
  }

  static async upsertCodeFiles(
    projectId: string,
    files: Array<{
      file_path: string;
      file_name: string;
      language: string;
      content: string;
      sha: string;
    }>
  ): Promise<CodeFile[]> {
    try {
      const { data, error } = await supabase
        .from('code_files')
        .upsert(
          files.map(file => ({
            ...file,
            project_id: projectId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_scanned_at: new Date().toISOString(),
          })),
          { onConflict: 'project_id,file_path' }
        )
        .select();

      if (error) {
        console.error('Error upserting code files:', error);
        throw new Error('Failed to upsert code files');
      }

      return data || [];
    } catch (error) {
      console.error('Error upserting code files:', error);
      throw error;
    }
  }
} 