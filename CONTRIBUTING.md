# Contributing to Craig

Thank you for your interest in contributing to Craig! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Contribution Types](#contribution-types)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Guidelines](#documentation-guidelines)
- [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for all contributors, regardless of background, experience level, gender identity, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- **Be respectful** and inclusive in communications
- **Be constructive** in feedback and criticism  
- **Be patient** with new contributors and users
- **Be collaborative** and helpful to others
- **Focus on the code and ideas**, not personal attributes

### Unacceptable Behavior

- Harassment, discrimination, or hostile behavior
- Personal attacks or inflammatory language
- Publishing private information without consent
- Spam, trolling, or disruptive behavior
- Any conduct that would be inappropriate in a professional setting

### Enforcement

Project maintainers are responsible for clarifying standards and may take appropriate corrective action in response to unacceptable behavior.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Development Environment**: Set up according to [Development Guide](./docs/DEVELOPMENT.md)
2. **GitHub Account**: For submitting pull requests
3. **Basic Knowledge**: Familiarity with Rust, TypeScript, and React
4. **AI Provider Access**: Claude Code and/or Gemini CLI for testing

### First Contribution

1. **Browse Issues**: Look for issues labeled `good first issue` or `help wanted`
2. **Read Documentation**: Familiarize yourself with the project structure
3. **Set Up Environment**: Follow the development setup guide
4. **Start Small**: Begin with documentation or small bug fixes
5. **Ask Questions**: Don't hesitate to ask for clarification on issues

## Development Process

### Workflow Overview

```
1. Fork Repository → 2. Create Branch → 3. Make Changes → 4. Test → 5. Submit PR → 6. Review → 7. Merge
```

### Detailed Steps

#### 1. Fork and Clone
```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/your-username/craig.git
cd craig
git remote add upstream https://github.com/original-username/craig.git
```

#### 2. Create Feature Branch
```bash
# Create descriptive branch name
git checkout -b feature/add-anthropic-provider
git checkout -b fix/memory-leak-in-sessions
git checkout -b docs/improve-installation-guide
```

#### 3. Set Up Development Environment
```bash
# Install dependencies
bun install

# Start development server
bun run tauri dev

# Run tests
cd src-tauri && cargo test
```

#### 4. Make Changes
- Follow [coding standards](#coding-standards)
- Write tests for new functionality
- Update documentation as needed
- Test changes thoroughly

#### 5. Commit Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add support for Anthropic's new model API

- Implement model discovery for new API endpoints
- Add configuration options for model selection
- Update tests to cover new functionality
- Add documentation for new features"
```

#### 6. Submit Pull Request
```bash
# Push to your fork
git push origin feature/add-anthropic-provider

# Create pull request on GitHub with detailed description
```

## Contribution Types

### Code Contributions

#### Bug Fixes
- **Identify**: Clear description of the bug and reproduction steps
- **Fix**: Minimal change that resolves the issue
- **Test**: Ensure fix works and doesn't break existing functionality
- **Document**: Update relevant documentation

#### New Features
- **Propose**: Create issue to discuss feature before implementation
- **Design**: Consider integration with existing architecture
- **Implement**: Follow established patterns and conventions
- **Test**: Comprehensive testing including edge cases
- **Document**: Update API docs, user guides, and inline comments

#### Performance Improvements
- **Benchmark**: Measure performance before and after changes
- **Profile**: Identify bottlenecks and optimization opportunities
- **Implement**: Make targeted improvements
- **Validate**: Verify improvements with benchmarks

### Documentation Contributions

#### User Documentation
- **Installation guides** for different platforms
- **Usage tutorials** for common workflows
- **Configuration examples** for various scenarios
- **Troubleshooting guides** for common issues

#### Developer Documentation
- **API reference** updates for new features
- **Architecture documentation** for complex systems
- **Contributing guides** and development workflows
- **Code comments** for complex algorithms

#### Content Guidelines
- **Clear and concise** language
- **Step-by-step instructions** with examples
- **Screenshots** for UI elements
- **Code blocks** properly formatted
- **Cross-references** to related sections

### Testing Contributions

#### Unit Tests
```rust
// Rust unit tests
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_provider_detection() {
        // Test implementation
    }
}
```

#### Integration Tests
```typescript
// TypeScript integration tests
describe('API Integration', () => {
  test('should connect to Gemini API', async () => {
    // Test implementation
  });
});
```

#### Manual Testing
- **Cross-platform testing** on different operating systems
- **Provider testing** with real API credentials
- **Performance testing** under load
- **Usability testing** with real workflows

### Design Contributions

#### UI/UX Improvements
- **Wireframes** for new features
- **Mockups** for design improvements
- **Icons** and visual assets
- **Accessibility** improvements

#### Architecture Design
- **System design** for new features
- **Database schema** improvements
- **API design** for new endpoints
- **Security architecture** reviews

## Pull Request Process

### Before Submitting

#### Checklist
- [ ] **Code compiles** without warnings
- [ ] **All tests pass** including new tests
- [ ] **Documentation updated** for changes
- [ ] **No breaking changes** without discussion
- [ ] **Commit messages** follow conventions
- [ ] **Branch up to date** with main

#### Self-Review
```bash
# Run comprehensive checks
bun run build                    # Frontend build
cd src-tauri && cargo build     # Backend build
cargo test                      # Run tests
cargo clippy                    # Rust linting
bunx tsc --noEmit               # TypeScript checking
```

### Pull Request Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe the tests you ran and how to reproduce them.

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information that would be helpful for reviewers.
```

### Review Process

#### Automated Checks
- **CI/CD pipeline** runs automatically
- **Build verification** on multiple platforms
- **Test execution** for all test suites
- **Code quality** analysis and linting

#### Manual Review
- **Code quality** and adherence to standards
- **Functionality** testing and validation
- **Documentation** completeness and accuracy
- **Architecture** alignment with project goals

#### Feedback and Iteration
- **Address feedback** promptly and thoroughly
- **Ask questions** if feedback is unclear
- **Make requested changes** in additional commits
- **Squash commits** before final merge if requested

## Coding Standards

### TypeScript/React Standards

#### File Organization
```typescript
// imports: external libraries first, then internal
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

// interfaces and types
interface ComponentProps {
  title: string;
  onSave: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

// component implementation
export const Component: React.FC<ComponentProps> = ({
  title,
  onSave,
  isLoading = false,
}) => {
  // hooks first
  const [data, setData] = useState<FormData | null>(null);
  
  // event handlers
  const handleSubmit = useCallback(async () => {
    if (data) {
      await onSave(data);
    }
  }, [data, onSave]);
  
  // render
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      {/* component content */}
    </div>
  );
};
```

#### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `SettingsPanel`)
- **Functions**: camelCase (`handleClick`, `fetchUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINT`, `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`UserData`, `ApiResponse`)

#### Code Style
```typescript
// Use explicit types
const users: User[] = await api.getUsers();

// Use const assertions where appropriate
const themes = ['light', 'dark'] as const;

// Prefer function declarations for top-level functions
function calculateCost(tokens: number, model: string): number {
  // implementation
}

// Use async/await over promises
const result = await api.fetchData();

// Error handling
try {
  const data = await api.riskyOperation();
  return data;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to perform operation');
}
```

### Rust Standards

#### Project Structure
```rust
// src/lib.rs
pub mod commands;
pub mod providers;
pub mod utils;

// src/commands/mod.rs
pub mod claude;
pub mod gemini;
pub mod shared;

// src/commands/gemini.rs
use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, command};

#[derive(Debug, Serialize, Deserialize)]
pub struct GeminiConfig {
    pub api_key: Option<String>,
    pub model: String,
}

#[command]
pub async fn get_gemini_config(app: AppHandle) -> Result<GeminiConfig, String> {
    // implementation
}
```

#### Naming Conventions
- **Functions**: snake_case (`get_user_data`, `parse_config`)
- **Types**: PascalCase (`UserData`, `ConfigError`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Modules**: snake_case (`user_management`, `api_client`)

#### Error Handling
```rust
use anyhow::{Context, Result};

// Use Result types for fallible operations
pub fn parse_config(path: &str) -> Result<Config> {
    let content = std::fs::read_to_string(path)
        .context("Failed to read config file")?;
    
    let config: Config = serde_json::from_str(&content)
        .context("Failed to parse config JSON")?;
    
    Ok(config)
}

// Use custom error types when needed
#[derive(Debug, thiserror::Error)]
pub enum ConfigError {
    #[error("Config file not found: {path}")]
    NotFound { path: String },
    #[error("Invalid configuration: {message}")]
    Invalid { message: String },
}
```

### Documentation Standards

#### Code Comments
```rust
/// Calculates the cost for API usage based on token count and model
/// 
/// # Arguments
/// * `tokens` - Number of tokens used
/// * `model` - Model identifier (e.g., "claude-4-sonnet", "gemini-pro")
/// 
/// # Returns
/// * `Result<f64>` - Cost in USD, or error if model is unknown
/// 
/// # Example
/// ```
/// let cost = calculate_cost(1000, "claude-4-sonnet")?;
/// assert!(cost > 0.0);
/// ```
pub fn calculate_cost(tokens: u64, model: &str) -> Result<f64> {
    // implementation
}
```

```typescript
/**
 * Executes a command with the specified AI provider
 * 
 * @param prompt - The prompt to send to the AI
 * @param provider - The AI provider to use ('claude' | 'gemini')
 * @param options - Additional options for the request
 * @returns Promise resolving to the AI response
 * 
 * @example
 * ```typescript
 * const response = await executeCommand(
 *   "Explain quantum computing",
 *   "claude",
 *   { model: "claude-4-sonnet" }
 * );
 * ```
 */
export async function executeCommand(
  prompt: string,
  provider: 'claude' | 'gemini',
  options?: CommandOptions
): Promise<string> {
  // implementation
}
```

## Testing Requirements

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: All API endpoints and critical workflows
- **UI Tests**: Key user interactions and edge cases
- **Performance Tests**: Resource usage and response times

### Testing Frameworks

#### Rust Testing
```rust
#[cfg(test)]
mod tests {
    use super::*;
    use tokio_test;
    
    #[tokio::test]
    async fn test_gemini_api_call() {
        // Setup
        let config = GeminiConfig {
            api_key: Some("test-key".to_string()),
            model: "gemini-pro".to_string(),
        };
        
        // Execute
        let result = execute_command(&config, "test prompt").await;
        
        // Assert
        assert!(result.is_ok());
    }
    
    #[test]
    fn test_config_parsing() {
        let json = r#"{"api_key": "test", "model": "gemini-pro"}"#;
        let config: GeminiConfig = serde_json::from_str(json).unwrap();
        assert_eq!(config.model, "gemini-pro");
    }
}
```

#### TypeScript Testing
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { api } from '@/lib/api';
import { Settings } from '@/components/Settings';

// Mock API calls
jest.mock('@/lib/api');
const mockApi = api as jest.Mocked<typeof api>;

describe('Settings Component', () => {
  beforeEach(() => {
    mockApi.getGeminiConfig.mockResolvedValue({
      api_key: 'test-key',
      model: 'gemini-pro'
    });
  });

  test('should load and display current settings', async () => {
    render(<Settings onBack={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('gemini-pro')).toBeInTheDocument();
    });
  });

  test('should save settings when form is submitted', async () => {
    mockApi.saveGeminiConfig.mockResolvedValue();
    
    render(<Settings onBack={() => {}} />);
    
    const apiKeyInput = screen.getByLabelText(/api key/i);
    fireEvent.change(apiKeyInput, { target: { value: 'new-key' } });
    
    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockApi.saveGeminiConfig).toHaveBeenCalledWith({
        api_key: 'new-key',
        model: 'gemini-pro'
      });
    });
  });
});
```

### Test Data and Mocks

#### Mock API Responses
```typescript
// tests/mocks/api.ts
export const mockGeminiConfig = {
  api_key: 'mock-api-key',
  model: 'gemini-pro',
  project_id: 'mock-project'
};

export const mockUsageStats = {
  total_cost: 12.34,
  total_tokens: 5000,
  by_provider: [
    {
      provider: 'claude',
      total_cost: 8.50,
      session_count: 3
    },
    {
      provider: 'gemini',
      total_cost: 3.84,
      session_count: 2
    }
  ]
};
```

## Documentation Guidelines

### Writing Style
- **Clear and Concise**: Use simple, direct language
- **Active Voice**: "Click the button" vs "The button should be clicked"
- **Specific Instructions**: "Enter your API key" vs "Configure authentication"
- **Consistent Terminology**: Use same terms throughout documentation

### Structure
- **Logical Flow**: Information in order of typical user workflow
- **Scannable Format**: Headers, lists, and code blocks for easy scanning
- **Cross-References**: Link to related sections and external resources
- **Examples**: Concrete examples for abstract concepts

### Code Examples
```markdown
# Good Example
## Setting Up Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select existing
3. Generate an API key:
   ```bash
   # The key will look like this:
   AIzaSyABC123def456ghi789jkl012mno345pqr678
   ```
4. Add the key to Craig:
   - Go to Settings → Gemini
   - Paste your key in the "API Key" field
   - Click "Test Connection" to verify

# Bad Example
## API Configuration
Configure your API settings in the application.
```

### Screenshots and Media
- **Relevant Screenshots**: Show exactly what users should see
- **Annotations**: Highlight important UI elements
- **Consistent Style**: Same OS/theme across all screenshots
- **Up-to-Date**: Update screenshots when UI changes

## Community

### Communication Channels
- **GitHub Issues**: Bug reports, feature requests, technical discussions
- **GitHub Discussions**: General questions, ideas, community showcase
- **Discord**: Real-time chat and collaboration (if available)
- **Email**: Security issues and private communications

### Community Guidelines
- **Be Helpful**: Assist other contributors and users
- **Share Knowledge**: Document solutions and share learnings
- **Respect Expertise**: Value different levels of experience
- **Encourage Participation**: Welcome new contributors

### Recognition
Contributors are recognized through:
- **Contributors List**: Maintained in repository
- **Release Notes**: Credit for significant contributions
- **Community Highlights**: Showcase exceptional contributions
- **Commit Attribution**: Proper git commit attribution

### Mentorship
- **Pairing Sessions**: Available for complex contributions
- **Code Reviews**: Educational feedback on submissions
- **Documentation Help**: Assistance with technical writing
- **Architecture Guidance**: Help with design decisions

---

Thank you for contributing to Craig! Your efforts help make AI development more accessible and productive for everyone.

For questions about contributing, please:
1. Check this guide and project documentation
2. Search existing GitHub issues and discussions
3. Create a new issue with the "question" label
4. Join our community discussions

**Remember**: Every contribution matters, whether it's code, documentation, bug reports, or community support!