import { CodeFileService } from '@/lib/services/code-file-service';
import { getBaseUrl } from '@/lib/utils/url';
import { Database } from '@/types/supabase';
import { Octokit } from '@octokit/rest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type Project = Database['public']['Tables']['projects']['Row'];

export interface ProjectEnvVar {
  id: string;
  project_id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export class ProjectService {
  private static async getOctokitClient(accessToken: string): Promise<Octokit> {
    return new Octokit({
      auth: accessToken,
      userAgent: '0PenAI',
    });
  }

  private static async fetchRepositoryFiles(
    octokit: Octokit,
    owner: string,
    repo: string,
    path: string = ''
  ): Promise<Array<{ path: string; content: string; sha: string }>> {
    const files: Array<{ path: string; content: string; sha: string }> = [];

    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.type === 'dir') {
            const subFiles = await this.fetchRepositoryFiles(
              octokit,
              owner,
              repo,
              item.path
            );
            files.push(...subFiles);
          } else if (item.type === 'file') {
            const { data: fileData } = await octokit.repos.getContent({
              owner,
              repo,
              path: item.path,
            });

            if ('content' in fileData) {
              files.push({
                path: item.path,
                content: Buffer.from(fileData.content, 'base64').toString(
                  'utf-8'
                ),
                sha: item.sha,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching files from ${path}:`, error);
    }

    return files;
  }

  static async createProject(
    userId: string,
    projectData: {
      project_name: string;
      description: string;
      target_url: string;
      scan_frequency: 'daily' | 'weekly' | 'monthly';
      repository_id: string;
      repository_full_name: string;
      repository_name: string;
      repository_description: string | null;
      repository_is_private: boolean;
    },
    envVariables: { key: string; value: string }[],
    accessToken: string | null
  ): Promise<{ project: Project | null; error?: string }> {
    try {
      const { data: project, error: supabaseError } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          project_name: projectData.project_name,
          description: projectData.description,
          target_url: projectData.target_url,
          scan_frequency: projectData.scan_frequency,
          repository_id: projectData.repository_id,
          repository_full_name: projectData.repository_full_name,
          repository_name: projectData.repository_name,
          repository_description: projectData.repository_description,
          repository_is_private: projectData.repository_is_private,
        })
        .select()
        .single();

      if (supabaseError) {
        console.error('Error creating project:', supabaseError);
        return { project: null, error: supabaseError.message };
      }

      let error: string | undefined;

      // Only attempt to fetch repository files if we have an access token
      if (accessToken) {
        try {
          const octokit = await this.getOctokitClient(accessToken);
          const [owner, repo] = projectData.repository_full_name.split('/');

          const files = await this.fetchRepositoryFiles(octokit, owner, repo);

          // Store files in the database
          await CodeFileService.upsertCodeFiles(
            project.id,
            files.map((file) => ({
              file_path: file.path,
              file_name: file.path.split('/').pop() || '',
              language: file.path.split('.').pop() || 'unknown',
              content: file.content,
              sha: file.sha,
            }))
          );
        } catch (err) {
          console.error('Error fetching repository files:', err);
          error =
            "Unable to fetch repository files - you can add files manually later. This won't affect your project setup.";
        }
      } else {
        error =
          "GitHub access token not found - you can add files manually later. This won't affect your project setup.";
      }

      return { project, error };
    } catch (err) {
      console.error('Error creating project:', err);
      return { project: null, error: 'Failed to create project' };
    }
  }

  static async getProjectsByUserId(userId: string): Promise<Project[]> {
    const response = await fetch(
      `${getBaseUrl()}/api/projects?userId=${encodeURIComponent(userId)}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  }

  static async getProjectById(projectId: string): Promise<Project | null> {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }

    return project;
  }

  static async getProjectEnvVars(projectId: string): Promise<ProjectEnvVar[]> {
    const response = await fetch(
      `${getBaseUrl()}/api/projects/${encodeURIComponent(projectId)}/env-vars`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch environment variables');
    }
    return response.json();
  }

  static async updateProject(
    projectId: string,
    updates: Partial<
      Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    >
  ): Promise<Project> {
    const response = await fetch(
      `${getBaseUrl()}/api/projects/${encodeURIComponent(projectId)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    return response.json();
  }

  static async deleteProject(projectId: string): Promise<void> {
    const response = await fetch(
      `${getBaseUrl()}/api/projects/${encodeURIComponent(projectId)}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  }

  static async checkUserProjectAccess(
    userId: string,
    projectId: string
  ): Promise<boolean> {
    const { data: access, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking project access:', error);
      return false;
    }

    return !!access;
  }
}
