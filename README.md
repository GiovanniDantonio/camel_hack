# 0PenAI (Zero Pen AI)

## Overview

0PenAI is an automated penetration testing platform powered by Large Language Models (LLMs). It integrates with GitHub for repository management, Supabase for authentication and data storage, and Vercel for deploying penetration test functions via serverless execution. The platform provides actionable vulnerability reports to security teams, helping them identify and remediate security risks in their codebases.

## (Tentative) Features

- **GitHub Integration**: Link repositories and automatically scan code on push events.
- **AI-Powered Security Analysis**: Uses LLMs (e.g., GPT-4o) to detect vulnerabilities.
- **Automated Penetration Testing**: Deploy attack simulations using serverless functions on Vercel.
- **Role-Based Access Control**: Authentication via GitHub OAuth with roles (Admin, Penetration Tester, Developer).
- **Dashboard & Reporting**: View detailed vulnerability reports with remediation steps.

**Link to drive**: https://drive.google.com/drive/u/0/folders/1qGgEzgr3zauh8nKFreW6_39UsC-bBpKB

## Current Implementation State

### Services
The application currently implements several core services:

- **ProjectService**: Manages project creation, retrieval, and GitHub repository integration
- **ScanService**: Handles security scanning operations with support for full, incremental, and targeted scans
- **AttackService**: Manages penetration testing simulations with various attack types
- **VulnerabilityService**: Tracks and manages discovered security vulnerabilities
- **CodeFileService**: Handles code file management and analysis

### API Routes
The application exposes several RESTful endpoints:

- **/api/projects**: Project management endpoints
- **/api/scans**: Security scan execution and management
- **/api/attacks**: Penetration testing simulation endpoints
- **/api/vulnerabilities**: Vulnerability tracking and management
- **/api/code-files**: Code file management endpoints

### Actions
Server actions implemented for key functionalities:

- **createScan**: Initiates security scans with configurable scan types
- **createAttack**: Launches penetration tests with various attack vectors (sql_injection, xss, csrf, rce, ssrf)

### Attack Types
Currently supported attack simulations:
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Remote Code Execution (RCE)
- Server-Side Request Forgery (SSRF)
- Other custom attacks

### Database Integration
The application uses Supabase for data persistence with tables for:
- Projects
- Scans
- Attacks
- Vulnerabilities
- Code Files

### Authentication
- GitHub OAuth integration via Auth0
- Role-based access control
- Secure session management

**Note**: The project is actively under development. Some features may be partially implemented or in progress.

## Implementation Notes & Pending Tasks

### GitHub Integration
- **Urgent**: GitHub access token implementation needed
- Currently limited to manual file uploads
- Need to implement proper GitHub API integration for:
  - Automatic code file extraction
  - Repository synchronization
  - Webhook handling for push events

### Security Scanning
- Basic scan creation is implemented but currently runs synchronously
- Need to implement:
  - Asynchronous scanning via serverless workers/functions
  - Frontend polling mechanism for real-time scan status updates
  - Enhanced AI guidance for detecting specific types of vulnerabilities
  - Expanded vulnerability detection patterns and heuristics

### Attack Simulation
- Basic CRUD operations for attacks are implemented
- Actual attack simulation execution is not yet implemented
- Need to implement workers/serverless functions to execute attack simulations

### UI/UX Improvements Needed
- Enhanced dashboard layout and visualization
- Improved scan and attack progress indicators
- Better error handling and user feedback
- More intuitive navigation and action flows
- Responsive design improvements
- Accessibility enhancements

### Technical Debt
- Need to refactor the code to be more modular and easier to maintain
- Need to add back tests that were removed during initial refactoring

### Known Limitations
- Manual file upload only (GitHub integration pending)
- Synchronous scan execution (needs to be async)
- Limited vulnerability detection patterns
- Basic attack simulation structure (no actual execution)
