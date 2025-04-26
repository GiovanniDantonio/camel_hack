# API Routes

This directory contains the API routes for the application. Below is an accurate description of each route category and its function based on the actual implementation:

## Authentication Routes (`/api/auth`)

API routes for handling user authentication through GitHub OAuth.

### `/api/auth/signin` (POST)

- **Description**: Initiates GitHub OAuth authentication flow
- **Request Input**:
  ```typescript
  {
    redirectTo?: string; // Optional path to redirect after auth (defaults to "/projects")
  }
  ```
- **Response**:
  ```typescript
  {
    url: string; // OAuth URL for client-side redirect
  }
  ```
  or error response:
  ```typescript
  {
    error: string; // Error message
  }
  ```

### `/api/auth/callback` (GET)

- **Description**: OAuth callback handler for GitHub authentication
- **Query Parameters**:
  ```
  next: string // Redirect path after authentication
  ```
- **Response**: Redirect to specified path with session cookie set

## Profile Routes (`/api/profile`)

API routes for managing user profiles and profile-related data.

### `/api/profile/github` (GET)

- **Description**: Retrieves the authenticated user's GitHub profile information from database
- **Request Input**: No input required (uses authenticated session)
- **Response**:
  ```typescript
  {
    githubProfile: {
      user_id: string;
      username: string;
      avatar_url: string;
      github_access_token: string;
      // Other GitHub profile fields from the database
    }
  }
  ```
  or error response:
  ```typescript
  {
    error: string; // Error message (e.g., "Unauthorized", "GitHub profile not found")
  }
  ```

## Projects Routes (`/api/projects`)

API routes for managing security scanning projects.

### `/api/projects/new` (POST)

- **Description**: Creates a new security scanning project
- **Request Input**:
  ```typescript
  {
    repository: {
      id: number;
      name: string;
      fullName: string;
      description: string;
    };
    metadata: {
      name: string;
      description?: string;
      scan_frequency?: string;
      target_url?: string;
    };
    env_variables?: Array<{
      key: string;
      value: string;
    }>;
  }
  ```
- **Response**:
  ```typescript
  {
    project: {
      id: string;
      project_name: string;
      description: string;
      repository_id: number;
      repository_name: string;
      repository_full_name: string;
      repository_description: string;
      repository_url: string;
      scan_frequency: string;
      target_url: string;
      user_id: string;
      created_at: string;
    }
  }
  ```
  or error response:
  ```typescript
  {
    error: string; // Error message
  }
  ```

### `/api/projects/settings` (GET/PUT/DELETE)

- **GET Description**: Retrieves project settings and configuration
- **GET Query Parameters**:
  ```
  id: string         // Project identifier
  ```
- **GET Response**:

  ```typescript
  {
    id: string;
    project_name: string;
    description: string;
    repository_id: number;
    repository_name: string;
    repository_full_name: string;
    repository_description: string;
    repository_url: string;
    scan_frequency: string;
    target_url: string;
    user_id: string;
    created_at: string;
    // Any other fields from the NEW_projects table
  }
  ```

- **PUT Description**: Updates project settings
- **PUT Request Input**:
  ```typescript
  {
    id: string;      // Project ID to update
    // Fields to update...
    name?: string;
    description?: string;
    scan_frequency?: string;
    target_url?: string;
  }
  ```
- **PUT Response**:

  ```typescript
  {
    success: boolean;
    project: {
      // Updated project data
    }
  }
  ```

- **DELETE Description**: Deletes a project
- **DELETE Query Parameters**:
  ```
  id: string         // Project identifier to delete
  ```
- **DELETE Response**:
  ```typescript
  {
    success: true;
  }
  ```

### `/api/projects/[id]` (Nested Routes)

#### `/api/projects/[id]/repository` (GET)

- **Description**: Retrieves project and repository information
- **Response**:
  ```typescript
  {
    project: {
      id: string;
      name: string;
      repository_full_name: string;
      repository_id: number;
      repository_name: string;
      repository_description: string;
      repository_is_private: boolean;
    }
    repository: {
      name: string;
      full_name: string;
      description: string;
      html_url: string;
      default_branch: string;
      created_at: string;
      updated_at: string;
      pushed_at: string;
      size: number;
      stars: number;
      forks: number;
      open_issues: number;
      watchers: number;
      license: any;
      private: boolean;
      branches: Array<{
        name: string;
        commit: {
          sha: string;
          message: string;
          date: string;
        };
      }>;
      languages: Record<string, number>;
    }
  }
  ```

#### `/api/projects/[id]/repository/content` (GET)

- **Description**: Retrieves file content from a repository
- **Query Parameters**:
  ```
  branch: string       // Repository branch
  path: string         // File path
  commit?: string      // Optional specific commit SHA
  ```
- **Response**:
  ```typescript
  {
    content: string; // File content
    path: string; // File path
    // Additional properties from GitHub API
  }
  ```

#### `/api/projects/[id]/repository/files` (GET)

- **Description**: Lists files and directories in a repository
- **Query Parameters**:
  ```
  branch: string       // Repository branch
  path?: string        // Directory path (default: root)
  commit?: string      // Optional specific commit SHA
  ```
- **Response**:
  ```typescript
  [
    {
      name: string;    // File/directory name
      path: string;    // Full path
      type: "file" | "dir";
      size?: number;   // For files
      // Additional properties from GitHub API
    }
  ]
  ```

#### `/api/projects/[id]/repository/commit` (GET)

- **Description**: Retrieves details about a specific commit
- **Query Parameters**:
  ```
  sha: string          // Commit identifier
  ```
- **Response**:
  ```typescript
  {
    sha: string;
    author: string;
    message: string;
    date: string;
    files: Array<{
      filename: string;
      status: string; // "added", "modified", "removed", etc.
      additions: number;
      deletions: number;
      changes: number;
    }>;
  }
  ```

## GitHub Integration (`/api/github`)

API routes for GitHub integration.

### `/api/github/repositories` (GET)

- **Description**: Retrieves list of GitHub repositories the user has access to
- **Response**:
  ```typescript
  [
    {
      id: number;
      name: string;
      fullName: string;
      description: string;
      isPrivate: boolean;
      updatedAt: string;
    }
  ]
  ```
  or error response:
  ```typescript
  {
    error: string;
  }
  ```

## Test Routes (`/api/test`)

API routes for testing functionality and integrations during development.

### `/api/test` (GET/POST)

- **GET Description**: Retrieves the status of a background task
- **GET Query Parameters**:
  ```
  rowId: string        // Task identifier
  ```
- **GET Response**:

  ```typescript
  {
    id: number;
    finished: boolean;
    data: string;
    created_at: string;
  }
  ```

- **POST Description**: Creates a new background task for testing
- **POST Request Input**: No input required
- **POST Response**:
  ```typescript
  {
    message: string; // "Task started"
    rowId: number; // Task identifier
  }
  ```
