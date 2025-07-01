# Usage Guide

This comprehensive guide covers how to use Craig effectively for multi-AI development workflows.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Workflows](#basic-workflows)
- [Multi-Provider Features](#multi-provider-features)
- [Project Management](#project-management)
- [Session Management](#session-management)
- [Usage Analytics](#usage-analytics)
- [Advanced Features](#advanced-features)
- [Tips and Best Practices](#tips-and-best-practices)

## Getting Started

### First Launch

1. **Launch Craig** from your applications or command line
2. **Welcome Screen**: Choose your starting point
   - **CC Projects**: Manage Claude Code projects and sessions
   - **CC Agents**: Create and run custom AI agents
   - **Settings**: Configure providers and preferences

3. **Initial Setup**: Craig will automatically detect installed AI CLIs
   - ✅ Claude Code detection
   - ✅ Gemini CLI detection
   - ⚠️ Missing installations will show setup instructions

### Quick Setup Checklist

- [ ] Claude Code CLI installed and working
- [ ] Gemini CLI installed (`npm install -g @google/gemini-cli`)
- [ ] API keys configured in Settings
- [ ] Connection tests successful
- [ ] First project or session created

## Basic Workflows

### Starting a New AI Session

#### Option 1: From Projects View
1. **Navigate to CC Projects**
2. **Select existing project** or create new one
3. **Choose provider**: Claude Code or Gemini
4. **Start session** with your first prompt

#### Option 2: From Quick Start
1. **Click the floating prompt input** (bottom of screen)
2. **Select model** from dropdown
3. **Type your prompt** and press Enter
4. **Session starts** with provider auto-selected

### Basic Conversation Flow

```
1. Type prompt → 2. Select model → 3. Send → 4. View response → 5. Continue conversation
```

Example interaction:
```
You: "Explain how to optimize React components for performance"
Craig (Claude): [Detailed explanation with code examples]
You: "Show me an example with useMemo"
Craig (Claude): [Specific useMemo example]
```

### Switching Between Providers

#### During Active Session
- **Model Selector**: Change model mid-conversation
- **Provider Icons**: Visual indicators for Claude vs Gemini
- **Seamless Switching**: Context preserved across providers

#### Comparing Responses
1. **Ask same question** to both providers
2. **Open multiple sessions** with different models
3. **Side-by-side comparison** in session list
4. **Usage tracking** shows cost comparison

## Multi-Provider Features

### Unified Interface

#### Single Command Center
- **One app** for multiple AI providers
- **Consistent UI** across all providers
- **Shared settings** and project management
- **Combined analytics** and usage tracking

#### Model Selection
```
Claude Models:
├── claude-4-opus      (Most capable)
├── claude-4-sonnet    (Balanced)
└── claude-3.5-sonnet  (Fast)

Gemini Models:
├── gemini-ultra       (Most capable)
├── gemini-pro         (Standard)
└── gemini-pro-vision  (Multimodal)
```

### Cross-Provider Workflows

#### Code Review Workflow
1. **Claude**: Generate initial code solution
2. **Gemini**: Review code for improvements
3. **Claude**: Refactor based on feedback
4. **Compare costs** and quality in analytics

#### Research Workflow
1. **Gemini**: Quick research and summaries
2. **Claude**: Detailed analysis and recommendations
3. **Both**: Different perspectives on complex topics
4. **Unified notes** in project sessions

## Project Management

### Creating Projects

#### New Project Setup
1. **Go to CC Projects**
2. **Create New Project** or import existing
3. **Set project path** (local directory)
4. **Configure preferences**:
   - Default AI provider
   - Model preferences
   - Access permissions

#### Project Structure
```
Project/
├── .claude/               # Claude Code metadata
├── src/                   # Your source code
├── docs/                  # Documentation
├── CLAUDE.md             # AI context file
└── sessions/             # Craig session history
```

### Managing Multiple Projects

#### Project Switching
- **Quick switcher**: Keyboard shortcut to jump between projects
- **Recent projects**: Quick access to recently used
- **Search**: Find projects by name or path
- **Favorites**: Pin frequently used projects

#### Project Settings
- **Provider preferences** per project
- **Custom access rules** for sensitive projects
- **Usage budgets** and alerts
- **Team sharing** configurations

### Project Templates

#### Available Templates
```
Templates:
├── web-development/      # React, Vue, Angular projects
├── data-science/         # Python, Jupyter, R projects
├── mobile-development/   # React Native, Flutter
├── backend-api/          # Node.js, Python, Go APIs
└── documentation/        # Writing and documentation
```

## Session Management

### Session Types

#### Interactive Sessions
- **Real-time conversation** with AI
- **Context preservation** across messages
- **Multi-turn dialogues** for complex tasks
- **Live editing** and iteration

#### Background Agents
- **Automated tasks** running in background
- **File monitoring** and processing
- **Scheduled operations** (future feature)
- **Batch processing** of multiple files

### Session Features

#### Timeline Navigation
- **Visual timeline** of conversation history
- **Checkpoint creation** at key moments
- **Branch conversations** from any point
- **Restore previous states** instantly

#### Session Sharing
- **Export conversations** as markdown or JSON
- **Share session links** with team members
- **Template creation** from successful sessions
- **Version control** integration

### Advanced Session Management

#### Session Forking
```
Main Session
├── Branch A: Alternative approach
├── Branch B: Different model attempt
└── Branch C: Refined solution
```

#### Context Management
- **Large context windows**: Up to 1M tokens (Gemini)
- **Smart summarization** for long sessions
- **Context injection** from files and docs
- **Memory management** for performance

## Usage Analytics

### Cost Tracking

#### Real-Time Monitoring
- **Live usage counter** during sessions
- **Per-message costs** displayed
- **Running totals** by provider
- **Budget alerts** when approaching limits

#### Detailed Analytics
```
Usage Dashboard:
├── Total Costs ($)
├── By Provider (Claude vs Gemini)
├── By Model (detailed breakdown)
├── By Project (cost attribution)
├── By Date (trends over time)
└── Token Usage (input/output/cache)
```

### Usage Optimization

#### Cost-Effective Strategies
1. **Model Selection**: Use appropriate model for task complexity
2. **Prompt Engineering**: Efficient prompts reduce token usage
3. **Context Management**: Remove unnecessary context
4. **Batch Operations**: Combine related queries

#### Usage Patterns
- **Peak usage times** identification
- **Most expensive operations** analysis
- **Provider efficiency** comparison
- **Model performance** vs cost analysis

### Reporting and Export

#### Export Options
- **CSV export** for spreadsheet analysis
- **JSON export** for custom analysis
- **PDF reports** for management
- **API integration** for enterprise systems

## Advanced Features

### Agent Creation

#### Custom Agent Types
```
Agent Types:
├── Code Review Agent    # Automated code analysis
├── Documentation Agent  # Auto-generate docs
├── Testing Agent       # Create and run tests
├── Security Scanner    # Security vulnerability checks
└── Custom Agents       # User-defined workflows
```

#### Agent Configuration
1. **Define agent purpose** and behavior
2. **Set trigger conditions** (file changes, schedules)
3. **Configure provider** and model
4. **Set security permissions** and sandbox rules
5. **Test and deploy** agent

### Automation Workflows

#### File Monitoring
```yaml
# Example workflow
workflow:
  trigger: file_change
  path: "src/**/*.js"
  agent: code_review_agent
  actions:
    - analyze_code
    - suggest_improvements
    - create_documentation
```

#### Integration Hooks
- **Git hooks**: Pre-commit, post-merge actions
- **CI/CD integration**: Automated analysis in pipelines
- **IDE plugins**: Direct integration with editors
- **Webhook support**: External system triggers

### Security and Sandboxing

#### Sandbox Profiles
```
Security Levels:
├── Unrestricted    # Full system access
├── Project-Only    # Limited to project directory
├── Read-Only       # No file modifications
└── Isolated        # Completely sandboxed
```

#### Permission Management
- **File system access** controls
- **Network access** restrictions
- **Process isolation** for safety
- **Audit logging** for compliance

## Tips and Best Practices

### Effective Prompting

#### Multi-Provider Strategies
- **Start with Gemini** for quick research and brainstorming
- **Use Claude** for detailed analysis and code generation
- **Compare responses** for important decisions
- **Leverage strengths**: Claude for coding, Gemini for research

#### Prompt Engineering
```
Good Prompt Structure:
1. Context: "I'm working on a React app..."
2. Task: "Help me optimize this component..."
3. Constraints: "Keep it under 100 lines..."
4. Format: "Provide code with explanations..."
```

### Cost Management

#### Budget Planning
1. **Set monthly budgets** for each provider
2. **Monitor daily usage** trends
3. **Use cost alerts** to prevent overages
4. **Review usage patterns** monthly

#### Optimization Strategies
- **Use appropriate models**: Don't use Opus for simple tasks
- **Batch similar queries** to reduce overhead
- **Leverage caching** for repeated content
- **Archive old sessions** to reduce storage costs

### Workflow Organization

#### Project Structure
```
Recommended Structure:
project/
├── CLAUDE.md           # Project context for AI
├── docs/
│   ├── requirements.md # Project requirements
│   └── decisions.md    # Design decisions
├── sessions/
│   ├── research/       # Research sessions
│   ├── implementation/ # Coding sessions
│   └── review/        # Code review sessions
└── src/               # Source code
```

#### Session Naming
- **Descriptive names**: "User Auth Implementation" vs "Session 1"
- **Date prefixes**: "2025-07-01 - API Design"
- **Provider indication**: "[Claude] Database Schema Design"
- **Status tags**: "[WIP] Payment Integration"

### Team Collaboration

#### Sharing Best Practices
1. **Export successful sessions** as templates
2. **Share agent configurations** across team
3. **Document prompt patterns** that work well
4. **Create team style guides** for AI interactions

#### Version Control Integration
```bash
# Add AI-generated files to .gitignore
echo "*.ai-session" >> .gitignore
echo ".craig/" >> .gitignore

# But commit important artifacts
git add CLAUDE.md
git add docs/ai-generated/
```

### Performance Optimization

#### Large Projects
- **Use project-specific contexts** instead of full codebase
- **Enable intelligent caching** for repeated queries
- **Archive old sessions** regularly
- **Monitor memory usage** during long sessions

#### Network Optimization
- **Configure proxies** for corporate environments
- **Use connection pooling** for multiple sessions
- **Enable compression** for large responses
- **Monitor API rate limits** to avoid throttling

This usage guide should help you get the most out of Craig's multi-AI capabilities. For specific technical details, refer to the [API Reference](./API_REFERENCE.md) and [Configuration Guide](./CONFIGURATION.md).