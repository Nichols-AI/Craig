# Craig API Reference

This document provides a comprehensive reference for Craig's API, covering both Claude Code and Gemini CLI integrations.

## Table of Contents

- [Overview](#overview)
- [File Management API](#file-management-api)
- [Claude Code API](#claude-code-api)
- [Gemini CLI API](#gemini-cli-api)
- [Usage Analytics API](#usage-analytics-api)
- [Settings Management API](#settings-management-api)
- [Error Handling](#error-handling)

## Overview

Craig provides a unified API for interacting with multiple AI providers through a consistent TypeScript interface. All API calls are made through the `api` object exported from `@/lib/api`.

```typescript
import { api } from "@/lib/api";
```

## File Management API

### Types

```typescript
interface FileEntry {
  name: string;
  path: string;
  is_directory: boolean;
  size: number;
  extension?: string;
}

interface DirectoryListingResponse {
  entries: FileEntry[];
  total_count: number;
  has_more: boolean;
  offset: number;
  limit: number;
}
```

### Methods

#### `api.listDirectoryContents(path: string)`
Lists files and directories in the specified path with enhanced error handling and automatic pagination.

```typescript
const entries = await api.listDirectoryContents("/path/to/directory");
// Returns: FileEntry[]
```

**Features:**
- **Smart Pagination**: Automatically limits results to 1000 items to prevent memory issues
- **Path Validation**: Comprehensive validation prevents path injection attacks
- **Error Recovery**: Gracefully handles broken symlinks, permission issues, and special files
- **Performance Optimized**: Results are cached with TTL for fast repeated access

#### `api.listDirectoryContentsPaginated(path: string, offset?: number, limit?: number)`
Advanced directory listing with explicit pagination control.

```typescript
const response = await api.listDirectoryContentsPaginated("/path/to/directory", 0, 100);
// Returns: DirectoryListingResponse
```

**Parameters:**
- `path`: Directory path to list
- `offset`: Starting position (default: 0)
- `limit`: Maximum items to return (default: 100, max: 1000)

#### `api.searchFiles(basePath: string, query: string)`
Search for files and directories matching a pattern with advanced filtering.

```typescript
const results = await api.searchFiles("/project/root", "component");
// Returns: FileEntry[]
```

**Features:**
- **Fuzzy Search**: Matches partial filenames and directory names
- **Smart Filtering**: Automatically excludes large directories like node_modules, target, .git
- **Result Limiting**: Returns maximum 50 results sorted by relevance
- **Security**: Query validation prevents injection attacks

### Error Handling

All file operations include comprehensive error handling:

```typescript
try {
  const files = await api.listDirectoryContents(path);
} catch (error) {
  // Handles: path not found, permission denied, invalid path, etc.
  console.error('File operation failed:', error.message);
}
```

**Common Error Scenarios:**
- Invalid or non-existent paths
- Permission denied errors
- Network mounted filesystems becoming unavailable
- Paths with invalid characters or excessive length
- Broken symlinks or special filesystem entries

## Claude Code API

### Types

```typescript
interface ClaudeSettings {
  [key: string]: any;
}

interface ClaudeInstallation {
  path: string;
  version?: string;
  source: string;
}

interface ClaudeVersionStatus {
  is_installed: boolean;
  version?: string;
  output: string;
}
```

### Methods

#### `api.getClaudeSettings()`
Get current Claude Code settings from `~/.claude/settings.json`.

```typescript
const settings = await api.getClaudeSettings();
```

#### `api.saveClaudeSettings(settings: ClaudeSettings)`
Save Claude Code settings.

```typescript
await api.saveClaudeSettings({
  model: "claude-4-sonnet",
  maxTokens: 4000
});
```

#### `api.checkClaudeVersion()`
Check Claude Code installation and version.

```typescript
const status = await api.checkClaudeVersion();
console.log(status.is_installed); // boolean
console.log(status.version); // string | undefined
```

#### `api.listClaudeInstallations()`
List all detected Claude Code installations.

```typescript
const installations = await api.listClaudeInstallations();
installations.forEach(install => {
  console.log(`${install.path} (${install.source})`);
});
```

## Gemini CLI API

### Types

```typescript
interface GeminiConfig {
  api_key?: string;
  model?: string;
  project_id?: string;
  [key: string]: any;
}

interface GeminiVersionStatus {
  is_installed: boolean;
  version?: string;
  output: string;
}
```

### Methods

#### `api.getGeminiVersion()`
Check Gemini CLI installation and version.

```typescript
const status = await api.getGeminiVersion();
if (status.is_installed) {
  console.log(`Gemini CLI ${status.version} is installed`);
}
```

#### `api.getGeminiConfig()`
Get current Gemini configuration.

```typescript
const config = await api.getGeminiConfig();
console.log(config.model); // Current default model
```

#### `api.saveGeminiConfig(config: GeminiConfig)`
Save Gemini configuration.

```typescript
await api.saveGeminiConfig({
  api_key: "your-api-key",
  model: "gemini-pro",
  project_id: "your-project-id"
});
```

#### `api.executeGeminiCommand(prompt: string, model?: string, projectPath?: string)`
Execute a Gemini CLI command.

```typescript
const response = await api.executeGeminiCommand(
  "Explain quantum computing",
  "gemini-pro",
  "/path/to/project"
);
```

#### `api.testGeminiConnection()`
Test Gemini API connection.

```typescript
const isConnected = await api.testGeminiConnection();
if (isConnected) {
  console.log("Gemini API is accessible");
}
```

#### `api.getGeminiModels()`
Get list of available Gemini models.

```typescript
const models = await api.getGeminiModels();
// ["gemini-pro", "gemini-pro-vision", "gemini-ultra"]
```

#### `api.stopGeminiProcess()`
Stop currently running Gemini process.

```typescript
await api.stopGeminiProcess();
```

## Usage Analytics API

### Types

```typescript
interface UsageStats {
  total_cost: number;
  total_tokens: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cache_creation_tokens: number;
  total_cache_read_tokens: number;
  total_sessions: number;
  by_provider: ProviderUsage[];
  by_model: ModelUsage[];
  by_date: DailyUsage[];
  by_project: ProjectUsage[];
}

interface ProviderUsage {
  provider: string; // "claude" | "gemini"
  total_cost: number;
  total_tokens: number;
  input_tokens: number;
  output_tokens: number;
  cache_creation_tokens: number;
  cache_read_tokens: number;
  session_count: number;
  models_used: string[];
}

interface ModelUsage {
  provider: string;
  model: string;
  total_cost: number;
  total_tokens: number;
  input_tokens: number;
  output_tokens: number;
  cache_creation_tokens: number;
  cache_read_tokens: number;
  session_count: number;
}
```

### Methods

#### `api.getUsageStats()`
Get comprehensive usage statistics for all providers.

```typescript
const stats = await api.getUsageStats();
console.log(`Total cost: $${stats.total_cost}`);
console.log(`Providers used: ${stats.by_provider.length}`);
```

#### `api.getUsageByDateRange(startDate: string, endDate: string)`
Get usage stats for a specific date range.

```typescript
const stats = await api.getUsageByDateRange("2025-01-01", "2025-01-31");
```

#### `api.getUsageDetails(projectPath?: string)`
Get detailed usage breakdown, optionally filtered by project.

```typescript
const details = await api.getUsageDetails("/path/to/project");
```

## Settings Management API

### Project Management

#### `api.listProjects()`
List all Claude Code projects.

```typescript
const projects = await api.listProjects();
projects.forEach(project => {
  console.log(`${project.id}: ${project.path}`);
});
```

#### `api.getProjectSessions(projectId: string)`
Get sessions for a specific project.

```typescript
const sessions = await api.getProjectSessions("project-id");
```

### Session Management

#### `api.openNewSession(projectPath: string, model?: string)`
Start a new AI session.

```typescript
const session = await api.openNewSession(
  "/path/to/project",
  "claude-4-sonnet" // or "gemini-pro"
);
```

#### `api.loadSessionHistory(projectPath: string, sessionId: string)`
Load history for an existing session.

```typescript
const history = await api.loadSessionHistory(projectPath, sessionId);
```

## Error Handling

All API methods throw errors that should be caught and handled appropriately:

```typescript
try {
  const config = await api.getGeminiConfig();
  // Handle success
} catch (error) {
  console.error("Failed to load Gemini config:", error);
  // Handle error - show user notification, retry, etc.
}
```

### Common Error Types

- **Installation Errors**: Provider CLI not found or not working
- **Configuration Errors**: Invalid API keys or settings
- **Network Errors**: API connection failures
- **Permission Errors**: File system access issues

### Error Recovery

Craig provides several error recovery mechanisms:

1. **Automatic Retry**: Some operations retry automatically
2. **Fallback Options**: Alternative providers when one fails
3. **User Notification**: Toast messages for user-actionable errors
4. **Graceful Degradation**: Disabled features when dependencies unavailable

## Rate Limiting and Quotas

### Claude Code
- Rate limits depend on your Anthropic subscription
- Monitor usage through the Usage Dashboard
- Costs calculated per million tokens

### Gemini CLI
- Free tier: 60 requests/minute, 1,000 requests/day
- Paid tier: Higher limits based on your Google Cloud configuration
- Monitor usage through the unified analytics dashboard

## Best Practices

1. **Check Installation Status**: Always verify CLI tools are installed before use
2. **Handle Errors Gracefully**: Implement proper error boundaries and user feedback
3. **Monitor Usage**: Use the analytics dashboard to track costs and usage
4. **Secure API Keys**: Store keys securely and never commit them to version control
5. **Test Connections**: Use connection test methods before executing commands
6. **Respect Rate Limits**: Implement appropriate delays and retry logic

## Examples

### Complete Multi-Provider Setup

```typescript
import { api } from "@/lib/api";

async function setupCraig() {
  // Check installations
  const claudeStatus = await api.checkClaudeVersion();
  const geminiStatus = await api.getGeminiVersion();
  
  console.log(`Claude: ${claudeStatus.is_installed ? 'Ready' : 'Not installed'}`);
  console.log(`Gemini: ${geminiStatus.is_installed ? 'Ready' : 'Not installed'}`);
  
  // Configure Gemini if installed
  if (geminiStatus.is_installed) {
    await api.saveGeminiConfig({
      api_key: process.env.GEMINI_API_KEY,
      model: "gemini-pro"
    });
    
    const connected = await api.testGeminiConnection();
    console.log(`Gemini API: ${connected ? 'Connected' : 'Failed'}`);
  }
  
  // Get usage stats
  const usage = await api.getUsageStats();
  console.log(`Total usage: $${usage.total_cost} across ${usage.by_provider.length} providers`);
}
```

This API reference covers all major functionality in Craig. For implementation details, see the source code in `src/lib/api.ts` and the corresponding Rust backend commands.