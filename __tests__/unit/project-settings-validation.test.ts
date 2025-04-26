/**
 * Project Settings Validation Tests
 *
 * This test suite focuses on testing the validation in the project settings API
 * for required fields like project_name.
 */

import { Database } from '@/types/database.types';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { NextResponse } from 'next/server';

// Define types that match the implementation in route.ts
type ProjectData = Database['public']['Tables']['projects']['Row'];

// Define Request type similar to what's used in the route
interface MockRequest {
  url: string;
  json: () => Promise<Partial<ProjectData>>;
}

// Define response types for NextResponse mock
interface MockResponseOptions {
  status?: number;
}

interface MockResponse {
  data: any;
  status: number;
  json: () => Promise<any>;
}

// Auth response type
interface AuthResponse {
  data: {
    user: {
      id: string;
      email: string;
    } | null;
  };
  error: null | Error;
}

// Supabase single result response type
interface SupabaseSingleResponse<T> {
  data: T | null;
  error: Error | null;
}

// Mock the URL constructor and searchParams
const mockURLGet = jest.fn().mockImplementation((param: string) => {
  if (param === 'id') return 'test-project-id';
  return null;
});

(global.URL as jest.Mock) = jest.fn().mockImplementation((url: string) => {
  return {
    searchParams: {
      get: mockURLGet,
    },
    url,
  };
});

// Mock the supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
        },
        error: null,
      } as AuthResponse),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}));

// Mock NextResponse
jest.mock('next/server', () => {
  const jsonMock = (
    data: any,
    options: MockResponseOptions = {}
  ): MockResponse => ({
    data,
    status: options.status || 200,
    json: () => Promise.resolve(data),
  });

  return {
    NextResponse: {
      json: jest.fn(jsonMock),
    },
  };
});

// Import the API route handler (PATCH function)
let { PATCH } = require('@/app/api/projects/settings/route');

describe('Project Settings API Validation', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset NextResponse mock
    const jsonImplementation = (
      data: any,
      options: MockResponseOptions = {}
    ): MockResponse => ({
      data,
      status: options.status || 200,
      json: () => Promise.resolve(data),
    });
    (NextResponse.json as jest.Mock).mockImplementation(jsonImplementation);

    // Setup mock Supabase client
    const { createClient } = require('@/lib/supabase/server');
    mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
            },
          },
          error: null,
        } as AuthResponse),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    // Mock existing project for ownership check
    mockSupabase.single.mockResolvedValueOnce({
      data: { user_id: 'test-user-id' },
      error: null,
    } as SupabaseSingleResponse<{ user_id: string }>);

    // Mock successful update response
    mockSupabase.single.mockResolvedValueOnce({
      data: {
        id: 'test-project-id',
        project_name: 'Updated Project',
        description: 'Updated description',
        scan_frequency: 'weekly',
        target_url: 'https://example.com',
        updated_at: '2023-01-01T00:00:00.000Z',
      },
      error: null,
    } as SupabaseSingleResponse<Partial<ProjectData>>);

    // Re-import to get fresh module with new mocks
    jest.isolateModules(() => {
      ({ PATCH } = require('@/app/api/projects/settings/route'));
    });
  });

  test('should successfully update project with valid data', async () => {
    // Create request with valid data
    const jsonFn = jest.fn().mockResolvedValue({
      project_name: 'Updated Project',
      description: 'Updated description',
      scan_frequency: 'weekly',
      target_url: 'https://example.com',
    } as Partial<ProjectData>);

    const mockRequest: MockRequest = {
      url: 'https://example.com/api/projects/settings?id=test-project-id',
      json: jsonFn,
    };

    const response = await PATCH(mockRequest);
    expect(response.status).toBe(200);
    expect(mockSupabase.from).toHaveBeenCalledWith('projects');
    expect(mockSupabase.update).toHaveBeenCalledWith({
      project_name: 'Updated Project',
      description: 'Updated description',
      scan_frequency: 'weekly',
      target_url: 'https://example.com',
      updated_at: expect.any(String),
    });
  });

  test('should reject update with empty project name', async () => {
    // Create request with empty project_name
    const jsonFn = jest.fn().mockResolvedValue({
      project_name: '', // Empty project name
      description: 'Updated description',
      scan_frequency: 'weekly',
      target_url: 'https://example.com',
    } as Partial<ProjectData>);

    const mockRequest: MockRequest = {
      url: 'https://example.com/api/projects/settings?id=test-project-id',
      json: jsonFn,
    };

    const response = await PATCH(mockRequest);

    // This test will now pass with our implementation
    expect(response.status).toBe(400);
    expect(response.data.error).toContain('Project name is required');

    // Ensure update wasn't called
    expect(mockSupabase.update).not.toHaveBeenCalled();
  });

  test('should reject update with missing project name', async () => {
    // Create request with missing project_name field
    const jsonFn = jest.fn().mockResolvedValue({
      // project_name is intentionally omitted
      description: 'Updated description',
      scan_frequency: 'weekly',
      target_url: 'https://example.com',
    } as Partial<ProjectData>);

    const mockRequest: MockRequest = {
      url: 'https://example.com/api/projects/settings?id=test-project-id',
      json: jsonFn,
    };

    const response = await PATCH(mockRequest);

    // This test will now pass with our implementation
    expect(response.status).toBe(400);
    expect(response.data.error).toContain('Project name is required');

    // Ensure update wasn't called
    expect(mockSupabase.update).not.toHaveBeenCalled();
  });

  test('should reject update with null project name', async () => {
    // Create request with null project_name
    const jsonFn = jest.fn().mockResolvedValue({
      project_name: null, // Null project name
      description: 'Updated description',
      scan_frequency: 'weekly',
      target_url: 'https://example.com',
    } as Partial<ProjectData>);

    const mockRequest: MockRequest = {
      url: 'https://example.com/api/projects/settings?id=test-project-id',
      json: jsonFn,
    };

    const response = await PATCH(mockRequest);

    // This test will now pass with our implementation
    expect(response.status).toBe(400);
    expect(response.data.error).toContain('Project name is required');

    // Ensure update wasn't called
    expect(mockSupabase.update).not.toHaveBeenCalled();
  });
});
