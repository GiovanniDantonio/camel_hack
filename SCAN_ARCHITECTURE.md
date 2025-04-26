# Security Scanning Architecture

This document outlines the security scanning architecture implemented in the application.

## Overview

The security scanning system uses a background processing approach to analyze code repositories for security vulnerabilities. It's designed to be scalable and extensible with AI-powered scanning agents.

## Key Components

### ScanService

- Manages CRUD operations for scans in the database
- Handles scan status updates and progress tracking
- Interfaces with Supabase for data storage

### VulnerabilityService

- Manages operations related to vulnerability data
- Handles creating, retrieving, and updating vulnerabilities
- Associates vulnerabilities with scans

### CodeFileService

- Manages code file data in the database
- Tracks file changes and content
- Supports multiple branches and commits

### ScanProcessor

- Main orchestrator for the scanning process
- Divides the scan into phases:
  - Initialization
  - Repository file fetching
  - Dependency analysis
  - File scanning for vulnerabilities
  - Results aggregation
  - Remediation generation
- Handles progress tracking and error handling

### ScanTaskManager

- Singleton manager for background scan tasks
- Controls task lifecycle and resource management
- Prevents duplicate scans
- Enables scan abortion

### SecurityAgent

- AI-powered agent for detecting vulnerabilities
- Analyzes code for security issues
- Currently uses a pattern-based approach, but designed to be replaced with LLM-based scanning

### AgentFactory

- Creates and manages SecurityAgent instances
- Supports multiple agents with different configurations
- Controls agent lifecycle

## API Endpoints

### Main Endpoints

- `POST /api/projects/[id]/scans` - Create a new scan
- `GET /api/projects/[id]/scans/[scanId]` - Get scan status
- `POST /api/projects/[id]/scans/[scanId]/abort` - Abort a running scan
- `GET /api/projects/[id]/scans/[scanId]/vulnerabilities` - Get scan vulnerabilities

## UI Components

- `AbortScanButton` - Allows users to abort running scans
- Scan status display with progress tracking
- Vulnerability summary display

## Modes of Operation

The system supports two modes of operation:

1. **Mock Mode** (`USE_MOCK_DATA=true`)

   - Uses simulated data and processes
   - Provides immediate feedback for testing and UI development
   - Doesn't require actual code analysis

2. **Real Mode** (`USE_MOCK_DATA=false`)
   - Uses actual background processing
   - Performs real code analysis
   - Interacts with database and GitHub API

## Background Processing

For real scans, the system:

1. Creates a scan record in the database
2. Starts a background task via ScanTaskManager
3. Processes the scan in phases
4. Updates progress in the database
5. Creates vulnerability records when issues are found

## Future Extensions

The system is designed to be extended with:

- More sophisticated LLM-based scanning
- Additional vulnerability detection capabilities
- Enhanced remediation recommendations
- Integration with CI/CD pipelines
- Scan scheduling
