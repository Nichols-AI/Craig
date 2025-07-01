# Configuration Guide

This guide covers all configuration options available in Craig, including provider setup, settings management, and advanced configuration.

## Table of Contents

- [Overview](#overview)
- [Configuration Files](#configuration-files)
- [Provider Configuration](#provider-configuration)
- [Application Settings](#application-settings)
- [Environment Variables](#environment-variables)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)

## Overview

Craig supports multiple configuration methods:

1. **GUI Settings Panel**: Primary configuration interface
2. **Configuration Files**: JSON-based settings storage
3. **Environment Variables**: Override settings for automation
4. **Command Line**: Future support for CLI configuration

All configurations are stored locally on your machine and never transmitted to external services unless explicitly configured.

## Configuration Files

### File Locations

Craig stores configuration in the following locations:

```
# Linux
~/.local/share/craig/
├── gemini_config.json      # Gemini CLI configuration
└── agents.db               # SQLite database for app settings

# macOS
~/Library/Application Support/craig/
├── gemini_config.json
└── agents.db

# Windows
%APPDATA%/craig/
├── gemini_config.json
└── agents.db

# Claude Code (managed separately)
~/.claude/
├── settings.json           # Claude Code settings
└── projects/               # Project sessions
```

### Configuration File Formats

#### Gemini Configuration (`gemini_config.json`)
```json
{
  "api_key": "your-gemini-api-key",
  "model": "gemini-pro",
  "project_id": "your-gcp-project-id"
}
```

#### Claude Settings (`~/.claude/settings.json`)
```json
{
  "model": "claude-4-sonnet",
  "maxTokens": 4000,
  "temperature": 0.7,
  "allowedPaths": ["/path/to/project"],
  "deniedPaths": ["/sensitive/path"],
  "env": {
    "CUSTOM_VAR": "value"
  }
}
```

## Provider Configuration

### Claude Code Configuration

Claude Code is configured through its native settings system. Craig inherits and extends these settings.

#### API Key Setup
```bash
# Claude Code handles its own authentication
claude auth login
```

#### Model Selection
Configure through Craig's Settings → General tab or directly in `~/.claude/settings.json`:

```json
{
  "model": "claude-4-sonnet",
  "temperature": 0.7
}
```

#### Available Models
- `claude-4-opus` - Most capable model
- `claude-4-sonnet` - Balanced performance and speed  
- `claude-3.5-sonnet` - Previous generation
- `claude-3-opus` - Legacy model

### Gemini CLI Configuration

#### API Key Setup

**Option 1: Through Craig UI**
1. Go to Settings → Gemini
2. Enter your API key from [Google AI Studio](https://aistudio.google.com/)
3. Test the connection

**Option 2: Environment Variable**
```bash
export GEMINI_API_KEY="your-api-key-here"
```

**Option 3: Direct File Edit**
```json
{
  "api_key": "your-gemini-api-key",
  "model": "gemini-pro",
  "project_id": "optional-gcp-project-id"
}
```

#### Available Models
- `gemini-pro` - Standard model (recommended)
- `gemini-pro-vision` - Multimodal with image support
- `gemini-ultra` - Most capable model (limited availability)

#### Pricing Tiers
- **Free Tier**: 60 requests/minute, 1,000 requests/day
- **Paid Tier**: Higher limits, production SLA

## Application Settings

### General Settings

#### Binary Path Management
Craig automatically detects AI CLI installations. You can override detection:

```json
{
  "claude_binary_path": "/custom/path/to/claude",
  "gemini_binary_path": "/custom/path/to/gemini"
}
```

#### Default Models
Set default models for new sessions:

```json
{
  "default_claude_model": "claude-4-sonnet",
  "default_gemini_model": "gemini-pro"
}
```

### Permission Settings

#### File System Access
Control which paths AI providers can access:

```json
{
  "allowedPaths": [
    "/home/user/projects",
    "/workspace"
  ],
  "deniedPaths": [
    "/home/user/.ssh",
    "/etc",
    "/sensitive-data"
  ]
}
```

#### Network Access
Configure network restrictions:

```json
{
  "allowNetworkAccess": true,
  "allowedDomains": [
    "api.anthropic.com",
    "generativelanguage.googleapis.com"
  ]
}
```

### Usage Tracking

#### Cost Monitoring
```json
{
  "usage_tracking": {
    "enabled": true,
    "cost_alerts": {
      "daily_limit": 10.00,
      "monthly_limit": 100.00
    },
    "export_format": "csv"
  }
}
```

#### Data Retention
```json
{
  "data_retention": {
    "usage_history_days": 365,
    "session_history_days": 90,
    "cleanup_on_startup": true
  }
}
```

## Environment Variables

Craig supports environment variables for automation and CI/CD scenarios:

### Provider Authentication
```bash
# Gemini API key
export GEMINI_API_KEY="your-key"

# Override model defaults
export CRAIG_DEFAULT_CLAUDE_MODEL="claude-4-opus"
export CRAIG_DEFAULT_GEMINI_MODEL="gemini-ultra"
```

### Application Behavior
```bash
# Disable GUI for headless operation
export CRAIG_HEADLESS=true

# Override config directory
export CRAIG_CONFIG_DIR="/custom/config/path"

# Enable debug logging
export CRAIG_LOG_LEVEL=debug
export RUST_LOG=debug
```

### Development Settings
```bash
# Development mode
export CRAIG_DEV_MODE=true

# Mock providers for testing
export CRAIG_MOCK_CLAUDE=true
export CRAIG_MOCK_GEMINI=true

# Skip binary detection
export CRAIG_SKIP_BINARY_CHECK=true
```

## Advanced Configuration

### Custom Binary Paths

For non-standard installations:

```json
{
  "binary_paths": {
    "claude": "/opt/claude-code/bin/claude",
    "gemini": "/usr/local/bin/gemini"
  },
  "binary_args": {
    "claude": ["--config", "/custom/claude.json"],
    "gemini": ["--project", "my-project"]
  }
}
```

### Proxy Configuration

For corporate environments:

```json
{
  "proxy": {
    "http_proxy": "http://proxy.company.com:8080",
    "https_proxy": "http://proxy.company.com:8080",
    "no_proxy": "localhost,127.0.0.1,.local"
  }
}
```

### Resource Limits

Control resource usage:

```json
{
  "limits": {
    "max_concurrent_sessions": 3,
    "session_timeout_minutes": 60,
    "max_tokens_per_request": 8000,
    "request_rate_limit": 10
  }
}
```

### Sandbox Configuration

Advanced security settings:

```json
{
  "sandbox": {
    "enabled": true,
    "profiles": {
      "default": {
        "filesystem_access": "restricted",
        "network_access": "api_only",
        "process_isolation": true
      },
      "development": {
        "filesystem_access": "project_only",
        "network_access": "full",
        "process_isolation": false
      }
    }
  }
}
```

### Logging Configuration

```json
{
  "logging": {
    "level": "info",
    "file": "/var/log/craig/craig.log",
    "max_size_mb": 100,
    "max_files": 5,
    "console_output": true
  }
}
```

## Configuration Examples

### Development Setup
```json
{
  "model": "claude-4-sonnet",
  "default_gemini_model": "gemini-pro",
  "allowedPaths": ["/workspace", "/home/dev/projects"],
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "true"
  },
  "usage_tracking": {
    "enabled": true,
    "cost_alerts": {
      "daily_limit": 5.00
    }
  }
}
```

### Production Environment
```json
{
  "model": "claude-4-opus",
  "default_gemini_model": "gemini-pro",
  "allowedPaths": ["/app", "/data"],
  "deniedPaths": ["/etc", "/root", "/home"],
  "usage_tracking": {
    "enabled": true,
    "cost_alerts": {
      "daily_limit": 50.00,
      "monthly_limit": 1000.00
    }
  },
  "sandbox": {
    "enabled": true,
    "profiles": {
      "production": {
        "filesystem_access": "restricted",
        "network_access": "api_only",
        "process_isolation": true
      }
    }
  }
}
```

### Enterprise Setup
```json
{
  "proxy": {
    "https_proxy": "http://corporate-proxy:8080"
  },
  "usage_tracking": {
    "enabled": true,
    "export_format": "json",
    "retention_days": 730
  },
  "audit_logging": {
    "enabled": true,
    "log_level": "detailed",
    "include_content": false
  }
}
```

## Troubleshooting

### Configuration Issues

#### Settings Not Saving
1. Check file permissions on config directory
2. Verify disk space availability
3. Check for file locks or readonly filesystem

#### Provider Not Detected
1. Verify CLI tool is installed: `claude --version` or `gemini --version`
2. Check PATH environment variable
3. Try specifying binary path manually

#### API Connection Failures
1. Verify API keys are correct
2. Check network connectivity
3. Test CLI tools independently
4. Review proxy settings if applicable

### Reset Configuration

#### Reset All Settings
```bash
# Backup first
cp ~/.local/share/craig/gemini_config.json ~/backup/

# Remove configuration files
rm -rf ~/.local/share/craig/
```

#### Reset Specific Provider
```bash
# Reset Gemini only
rm ~/.local/share/craig/gemini_config.json

# Reset Claude only (careful - this affects Claude Code globally)
mv ~/.claude/settings.json ~/.claude/settings.json.backup
```

### Validation

#### Check Configuration Validity
```bash
# Validate JSON syntax
cat ~/.local/share/craig/gemini_config.json | jq .

# Test provider connections
craig --test-connections  # Future CLI feature
```

#### Debug Configuration Loading
Enable debug logging to see configuration loading:

```bash
CRAIG_LOG_LEVEL=debug craig
```

This will show detailed information about configuration file discovery and parsing.

## Best Practices

1. **Security**: Never commit API keys to version control
2. **Backup**: Regularly backup configuration files
3. **Validation**: Use JSON validators for manual edits
4. **Documentation**: Document custom configurations for team sharing
5. **Testing**: Test configuration changes in development first

For additional help with configuration, see the [API Reference](./API_REFERENCE.md) and [Troubleshooting Guide](./TROUBLESHOOTING.md).