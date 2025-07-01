# Development Guide

This guide covers the development workflow, architecture, and contribution guidelines for Craig.

## Table of Contents

- [Development Setup](#development-setup)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style and Standards](#code-style-and-standards)
- [Testing](#testing)
- [Debugging](#debugging)
- [Contributing](#contributing)
- [Release Process](#release-process)

## Development Setup

### Prerequisites

Ensure you have all the required tools installed as described in [INSTALLATION.md](./INSTALLATION.md).

### Quick Start

```bash
# Clone and setup
git clone https://github.com/Nichols-AI/Craig.git
cd Craig

# Simple startup (recommended)
./craig

# Or manual startup
bun install
bun run tauri dev
```

The `./craig` launcher provides optimized startup with automatic dependency installation and enhanced build settings for faster development.

### Development Commands

```bash
# Frontend development (UI only)
bun run dev                 # Start Vite dev server
bun run build              # Build frontend for production
bun run preview            # Preview production build

# Tauri development
bun run tauri dev          # Start app with hot reload
bun run tauri build        # Build production app
bun run tauri build --debug # Build debug version

# Code quality
bunx tsc --noEmit          # Type checking
bunx prettier --write .    # Format code
bunx eslint --fix .        # Lint and fix

# Backend (Rust)
cd src-tauri
cargo test                 # Run Rust tests
cargo fmt                  # Format Rust code
cargo clippy               # Lint Rust code
```

## Architecture Overview

Craig is built with a modern, multi-layer architecture:

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 6
- **Backend**: Rust with Tauri 2
- **UI Framework**: Tailwind CSS v4 + shadcn/ui
- **Database**: SQLite (via rusqlite)
- **Package Manager**: Bun
- **Build System**: Tauri + Vite

### Core Principles

1. **Multi-Provider Support**: Unified interface for multiple AI providers
2. **Type Safety**: Full TypeScript coverage with strict mode
3. **Performance**: Rust backend for speed, React frontend for UX
4. **Security**: Sandboxed execution and secure API handling
5. **Extensibility**: Plugin-like architecture for adding new providers

## Project Structure

```
craig/
├── src/                     # React frontend
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   ├── Settings.tsx    # Multi-provider settings
│   │   ├── UsageDashboard.tsx # Usage analytics
│   │   └── ...             # Feature components
│   ├── lib/                # Utilities and API client
│   │   ├── api.ts          # Unified API client
│   │   ├── utils.ts        # Helper functions
│   │   └── ...
│   ├── assets/             # Static assets
│   ├── styles.css          # Global styles
│   └── main.tsx            # App entry point
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── commands/       # Tauri command handlers
│   │   │   ├── claude.rs   # Claude Code integration
│   │   │   ├── gemini.rs   # Gemini CLI integration
│   │   │   ├── usage.rs    # Usage analytics
│   │   │   └── ...
│   │   ├── sandbox/        # Security sandboxing
│   │   ├── checkpoint/     # Session management
│   │   ├── claude_binary.rs # Claude CLI management
│   │   ├── gemini_binary.rs # Gemini CLI management
│   │   ├── lib.rs          # Library exports
│   │   └── main.rs         # App entry point
│   ├── tests/              # Rust tests
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── docs/                   # Documentation
├── public/                 # Static assets
├── package.json            # Frontend dependencies
└── README.md               # Project overview
```

### Key Modules

#### Frontend (`src/`)

- **`components/`**: React components with TypeScript
  - `ui/`: Reusable UI primitives
  - Feature-specific components
  - Provider-agnostic interfaces

- **`lib/api.ts`**: Unified API client
  - TypeScript interfaces for all providers
  - Consistent error handling
  - Promise-based async operations

#### Backend (`src-tauri/src/`)

- **`commands/`**: Tauri command handlers
  - Each provider has its own module
  - Consistent patterns across providers
  - Error handling and validation

- **Binary Management**: 
  - `claude_binary.rs`: Claude Code detection and management
  - `gemini_binary.rs`: Gemini CLI detection and management
  - Auto-discovery and version checking

- **Core Features**:
  - `usage.rs`: Multi-provider usage analytics
  - `sandbox/`: Security and isolation
  - `checkpoint/`: Session state management

## Development Workflow

### 1. Feature Development

#### Adding a New AI Provider

1. **Backend Implementation**:
   ```bash
   # Create new binary management module
   touch src-tauri/src/new_provider_binary.rs
   
   # Create new commands module
   touch src-tauri/src/commands/new_provider.rs
   ```

2. **Follow Existing Patterns**:
   - Copy structure from `gemini_binary.rs` and `commands/gemini.rs`
   - Implement consistent interfaces
   - Add to `main.rs` imports and command registration

3. **Frontend Integration**:
   - Add TypeScript interfaces to `lib/api.ts`
   - Add API methods following existing patterns
   - Create/update UI components

4. **Testing and Documentation**:
   - Write unit tests
   - Update API documentation
   - Add to settings panel

#### Adding a New Feature

1. **Plan the Implementation**:
   - Design TypeScript interfaces
   - Plan Rust command structure
   - Consider UI/UX requirements

2. **Implement Backend**:
   - Add Rust functions with proper error handling
   - Write unit tests
   - Update command registration

3. **Implement Frontend**:
   - Add TypeScript types and API methods
   - Create React components
   - Add to appropriate UI sections

4. **Integration Testing**:
   - Test end-to-end workflows
   - Verify error handling
   - Check performance impact

### 2. Bug Fixes

1. **Reproduce the Issue**:
   - Write a failing test if possible
   - Document steps to reproduce
   - Identify root cause

2. **Fix Implementation**:
   - Make minimal changes
   - Preserve existing behavior
   - Add regression tests

3. **Verification**:
   - Test the specific fix
   - Run full test suite
   - Manual testing of related features

### 3. Code Review Process

1. **Self Review**:
   - Run all tests and linting
   - Check TypeScript compilation
   - Test in development mode

2. **Create Pull Request**:
   - Clear description of changes
   - Link to related issues
   - Include screenshots for UI changes

3. **Review Checklist**:
   - [ ] Code follows established patterns
   - [ ] TypeScript types are accurate
   - [ ] Error handling is comprehensive
   - [ ] Tests cover new functionality
   - [ ] Documentation is updated

## Code Style and Standards

### TypeScript/React

```typescript
// Use explicit types
interface ComponentProps {
  title: string;
  onSave: (data: ConfigData) => void;
  isLoading?: boolean;
}

// Prefer function components with hooks
const Component: React.FC<ComponentProps> = ({ title, onSave, isLoading = false }) => {
  const [data, setData] = useState<ConfigData | null>(null);
  
  // Clear function naming
  const handleSubmit = useCallback(async () => {
    if (data) {
      await onSave(data);
    }
  }, [data, onSave]);
  
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      {/* ... */}
    </div>
  );
};
```

### Rust

```rust
// Use descriptive names and proper error handling
pub async fn execute_provider_command(
    app: AppHandle,
    prompt: String,
    model: Option<String>,
    project_path: Option<String>,
) -> Result<String, String> {
    log::info!("Executing provider command with model: {:?}", model);
    
    let binary_path = find_provider_binary(&app)
        .map_err(|e| format!("Provider CLI not found: {}", e))?;
    
    // Implementation...
    
    Ok(output)
}

// Consistent error types
#[derive(Debug, Serialize, Deserialize)]
pub struct ProviderError {
    pub message: String,
    pub code: Option<String>,
    pub details: Option<serde_json::Value>,
}
```

### Component Patterns

Follow these established patterns:

#### Settings Components
```typescript
// Multi-tab settings with consistent structure
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="provider" className="gap-2">
      <ProviderIcon className="h-4 w-4 text-provider-color" />
      Provider Name
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="provider" className="space-y-6">
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold mb-4">Configuration</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Description of what this section configures
          </p>
        </div>
        
        {/* Form fields with consistent styling */}
        <div className="space-y-2">
          <Label htmlFor="field">Field Label</Label>
          <Input
            id="field"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Help text for the field
          </p>
        </div>
      </div>
    </Card>
  </TabsContent>
</Tabs>
```

#### API Error Handling
```typescript
try {
  const result = await api.providerMethod();
  setToast({ message: "Success!", type: "success" });
} catch (error) {
  setToast({ 
    message: `Operation failed: ${error}`, 
    type: "error" 
  });
}
```

## Testing

### Frontend Testing

```bash
# Run TypeScript type checking
bunx tsc --noEmit

# Test component functionality manually
bun run tauri dev
```

### Backend Testing

```bash
cd src-tauri

# Run all tests
cargo test

# Run specific test module
cargo test test_module_name

# Run tests with output
cargo test -- --nocapture

# Test with specific features
cargo test --features feature_name
```

### Integration Testing

1. **Manual Testing Checklist**:
   - [ ] Both providers detect correctly
   - [ ] Settings save and load properly
   - [ ] Usage tracking works for both providers
   - [ ] Error states display correctly
   - [ ] Connection tests work

2. **Automated Testing**:
   - Unit tests for all Rust modules
   - Integration tests for command flows
   - Mock provider responses for frontend testing

## Debugging

### Frontend Debugging

```typescript
// Use browser dev tools
console.log("Debug data:", data);

// Error boundaries for crash protection
<ErrorBoundary fallback={<ErrorMessage />}>
  <Component />
</ErrorBoundary>
```

### Backend Debugging

```rust
// Enable logging
log::debug!("Debug information: {:?}", data);
log::error!("Error occurred: {}", error);

// Use cargo for detailed output
RUST_LOG=debug cargo test test_name -- --nocapture
```

### Development Tools

- **Browser DevTools**: For frontend debugging
- **Tauri DevTools**: For bridge debugging
- **Rust Analyzer**: For Rust development
- **TypeScript Language Server**: For TypeScript development

## Contributing

### Getting Started

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/new-provider`
3. **Make Changes**: Follow the patterns established in the codebase
4. **Test Thoroughly**: Ensure all tests pass
5. **Submit Pull Request**: With clear description

### Pull Request Guidelines

- **Clear Title**: Describe what the PR does
- **Detailed Description**: Explain the changes and why
- **Screenshots**: For UI changes
- **Breaking Changes**: Clearly marked and documented
- **Tests**: Include tests for new functionality

### Code Review Process

1. **Automated Checks**: All CI checks must pass
2. **Manual Review**: Code review by maintainers
3. **Testing**: Manual testing of new features
4. **Documentation**: Ensure docs are updated

## Release Process

### Version Numbering

Craig follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Release Steps

1. **Update Version Numbers**:
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`

2. **Update Documentation**:
   - `CHANGELOG.md`
   - API documentation if needed
   - README if needed

3. **Build and Test**:
   ```bash
   bun run build
   bun run tauri build
   ```

4. **Create Release**:
   - Tag version: `git tag v0.1.0`
   - Push tags: `git push --tags`
   - Create GitHub release with binaries

### Distribution

- **GitHub Releases**: Primary distribution method
- **Package Managers**: Future consideration (Homebrew, Chocolatey, etc.)
- **Build Instructions**: Always available for building from source

This development guide should help you contribute effectively to Craig. For specific questions, please check the existing codebase for patterns and examples.