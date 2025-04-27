import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VulnerabilitiesPage from '../page';

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'test-project', scanId: 'test-scan' }),
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn() }),
}));

// Mock next-themes
jest.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light' }) }));

// Mock fetch for vulnerabilities and scan/project data
beforeAll(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/scans/')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ commit_hash: 'abc123', branch: 'main' }) });
    }
    if (url.includes('/api/projects/') && !url.includes('/scans/')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ repository_url: 'https://github.com/test/repo.git' }) });
    }
    if (url.includes('/vulnerabilities')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: '1', severity: 'critical', file_path: 'file1.js', line_start: 10, title: 'Critical bug' },
          { id: '2', severity: 'high', file_path: 'file2.js', line_start: 20, title: 'High bug' },
          { id: '3', severity: 'medium', file_path: 'file3.js', line_start: 30, title: 'Medium bug' },
          { id: '4', severity: 'low', file_path: 'file4.js', line_start: 40, title: 'Low bug' },
        ]),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('VulnerabilitiesPage severity filter', () => {
  it('shows all vulnerabilities by default', async () => {
    render(<VulnerabilitiesPage />);
    expect(await screen.findByText('Critical bug')).toBeInTheDocument();
    expect(screen.getByText('High bug')).toBeInTheDocument();
    expect(screen.getByText('Medium bug')).toBeInTheDocument();
    expect(screen.getByText('Low bug')).toBeInTheDocument();
  });

  it('filters vulnerabilities by severity', async () => {
    render(<VulnerabilitiesPage />);
    // Open filter menu
    fireEvent.click(await screen.findByLabelText('Filter vulnerabilities'));
    // Select High
    fireEvent.click(screen.getByText('High'));
    // Only High bug should be visible
    expect(await screen.findByText('High bug')).toBeInTheDocument();
    expect(screen.queryByText('Critical bug')).not.toBeInTheDocument();
    expect(screen.queryByText('Medium bug')).not.toBeInTheDocument();
    expect(screen.queryByText('Low bug')).not.toBeInTheDocument();
  });

  it('filters vulnerabilities by severity: critical', async () => {
    render(<VulnerabilitiesPage />);
    fireEvent.click(await screen.findByLabelText('Filter vulnerabilities'));
    fireEvent.click(screen.getByText('Critical'));
    expect(await screen.findByText('Critical bug')).toBeInTheDocument();
    expect(screen.queryByText('High bug')).not.toBeInTheDocument();
    expect(screen.queryByText('Medium bug')).not.toBeInTheDocument();
    expect(screen.queryByText('Low bug')).not.toBeInTheDocument();
  });

  it('shows all vulnerabilities when All is selected', async () => {
    render(<VulnerabilitiesPage />);
    fireEvent.click(await screen.findByLabelText('Filter vulnerabilities'));
    fireEvent.click(screen.getByText('All'));
    expect(await screen.findByText('Critical bug')).toBeInTheDocument();
    expect(screen.getByText('High bug')).toBeInTheDocument();
    expect(screen.getByText('Medium bug')).toBeInTheDocument();
    expect(screen.getByText('Low bug')).toBeInTheDocument();
  });
});
