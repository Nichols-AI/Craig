<div align="center">
  <img src="https://github.com/user-attachments/assets/92fd93ed-e71b-4b94-b270-50684323dd00" alt="Craig Logo" width="120" height="120">

  <h1>Craig</h1>
  
  <p>
    <strong>A powerful Multi-AI Desktop Client for Claude Code and Gemini CLI</strong>
  </p>
  <p>
    <strong>Create custom agents, manage interactive AI sessions, run secure background agents with multiple AI providers, and more.</strong>
  </p>
  
  <p>
    <a href="https://craig.nicholsai.com"><img src="https://img.shields.io/badge/Website-🌐-blue?style=for-the-badge" alt="Website"></a>
    <a href="#features"><img src="https://img.shields.io/badge/Features-✨-green?style=for-the-badge" alt="Features"></a>
    <a href="#installation"><img src="https://img.shields.io/badge/Install-🚀-orange?style=for-the-badge" alt="Installation"></a>
    <a href="#usage"><img src="https://img.shields.io/badge/Usage-📖-purple?style=for-the-badge" alt="Usage"></a>
    <a href="#development"><img src="https://img.shields.io/badge/Develop-🛠️-red?style=for-the-badge" alt="Development"></a>
  </p>
</div>

![Craig Multi-AI Desktop Client](https://github.com/user-attachments/assets/a028de9e-d881-44d8-bae5-7326ab3558b9)

> [!TIP]
> **⭐ Star the repo and follow [@NICHOLSAI1130](https://x.com/NICHOLSAI1130) on X for updates on multi-AI development tools**.

> [!NOTE]
> **Craig is forked from [Claudia](https://github.com/getAsterisk/claudia) by Asterisk. All original features are preserved while adding comprehensive multi-AI provider support.**

## 🌟 Overview

**Craig** is a powerful desktop application that transforms how you interact with multiple AI services. Built with Tauri 2, it provides a beautiful unified GUI for managing Claude Code and Gemini CLI sessions, creating custom agents, tracking usage across providers, and much more.

Think of Craig as your command center for AI-assisted development - bridging the gap between multiple command-line AI tools and a visual experience that makes multi-AI workflows more intuitive and productive.

### 🆕 What's New in Craig

- **🤖 Multi-AI Support**: Seamlessly switch between Claude Code and Gemini CLI
- **🔄 Unified Interface**: Single app for multiple AI providers
- **📊 Provider-Aware Analytics**: Track usage and costs across all AI services
- **⚡ Seamless Switching**: Change AI providers mid-conversation
- **💼 Pro Subscription Support**: Full support for both Claude Pro and Gemini Pro

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
  - [🤖 Multi-AI Provider Support](#-multi-ai-provider-support)
  - [🗂️ Project & Session Management](#️-project--session-management)
  - [📁 Enhanced File Management](#-enhanced-file-management)
  - [🤖 CC Agents](#-cc-agents)
  - [🛡️ Advanced Sandboxing](#️-advanced-sandboxing)
  - [📊 Multi-Provider Analytics Dashboard](#-multi-provider-analytics-dashboard)
  - [🔌 MCP Server Management](#-mcp-server-management)
  - [⏰ Timeline & Checkpoints](#-timeline--checkpoints)
  - [📝 CLAUDE.md Management](#-claudemd-management)
- [📖 Usage](#-usage)
  - [Getting Started](#getting-started)
  - [Managing Projects](#managing-projects)
  - [Creating Agents](#creating-agents)
  - [Multi-AI Workflows](#multi-ai-workflows)
  - [Tracking Usage](#tracking-usage)
  - [Working with MCP Servers](#working-with-mcp-servers)
- [🚀 Installation](#-installation)
- [🔨 Build from Source](#-build-from-source)
- [🛠️ Development](#️-development)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

## ✨ Features

### 🤖 **Multi-AI Provider Support**
- **Unified Interface**: Single desktop app for Claude Code and Gemini CLI
- **Seamless Provider Switching**: Change AI providers mid-conversation without losing context
- **Provider-Specific Settings**: Individual configuration for each AI service
- **Subscription Management**: Full support for Claude Pro and Gemini Pro subscriptions
- **Model Selection**: Choose from available models for each provider
- **API Key Management**: Secure storage and handling of credentials for all providers

### 🗂️ **Project & Session Management**
- **Visual Project Browser**: Navigate through all your Claude Code projects in `~/.claude/projects/`
- **Session History**: View and resume past coding sessions with full context
- **Smart Search**: Find projects and sessions quickly with built-in search
- **Session Insights**: See first messages, timestamps, and session metadata at a glance
- **Multi-Provider Sessions**: Sessions can span multiple AI providers

### 📁 **Enhanced File Management**
- **Robust FilePicker**: Browse and select files/directories with advanced error handling
- **Large Directory Support**: Handles directories with thousands of files without crashing
- **Smart Pagination**: Automatically limits directory listings to prevent memory issues
- **Path Security**: Advanced validation prevents path injection and filesystem errors
- **Error Recovery**: Graceful handling of broken symlinks, permission issues, and special files
- **Performance Optimized**: Smart caching with TTL and memory management for fast navigation

### 🤖 **CC Agents**
- **Custom AI Agents**: Create specialized agents with custom system prompts and behaviors
- **Multi-Provider Agents**: Agents can use any configured AI provider
- **Agent Library**: Build a collection of purpose-built agents for different tasks
- **Secure Execution**: Run agents in sandboxed environments with fine-grained permissions
- **Execution History**: Track all agent runs with detailed logs and performance metrics

### 🛡️ **Advanced Sandboxing**
- **OS-Level Security**: Platform-specific sandboxing (seccomp on Linux, Seatbelt on macOS)
- **Permission Profiles**: Create reusable security profiles with granular access controls
- **Violation Tracking**: Monitor and log all security violations in real-time
- **Import/Export**: Share sandbox profiles across teams and systems

### 📊 **Multi-Provider Analytics Dashboard**
- **Cross-Provider Cost Tracking**: Monitor usage and costs across Claude and Gemini
- **Provider Comparison**: Compare performance and costs between AI services
- **Token Analytics**: Detailed breakdown by model, project, provider, and time period
- **Visual Charts**: Beautiful charts showing usage trends and patterns across providers
- **Export Data**: Export usage data for accounting and analysis
- **Budget Tracking**: Set and monitor spending limits per provider

### 🔌 **MCP Server Management**
- **Server Registry**: Manage Model Context Protocol servers from a central UI
- **Easy Configuration**: Add servers via UI or import from existing configs
- **Connection Testing**: Verify server connectivity before use
- **Claude Desktop Import**: Import server configurations from Claude Desktop

### ⏰ **Timeline & Checkpoints**
- **Session Versioning**: Create checkpoints at any point in your coding session
- **Visual Timeline**: Navigate through your session history with a branching timeline
- **Instant Restore**: Jump back to any checkpoint with one click
- **Fork Sessions**: Create new branches from existing checkpoints
- **Diff Viewer**: See exactly what changed between checkpoints

### 📝 **CLAUDE.md Management**
- **Built-in Editor**: Edit CLAUDE.md files directly within the app
- **Live Preview**: See your markdown rendered in real-time
- **Project Scanner**: Find all CLAUDE.md files in your projects
- **Syntax Highlighting**: Full markdown support with syntax highlighting

## 📖 Usage

### Getting Started

1. **Launch Craig**: Open the application after installation
2. **Welcome Screen**: Choose between CC Agents or CC Projects
3. **First Time Setup**: Craig will automatically detect your `~/.claude` directory
4. **Configure AI Providers**: Set up Claude Code and/or Gemini CLI API keys

### Managing Projects

```
CC Projects → Select Project → View Sessions → Resume or Start New
```

- Click on any project to view its sessions
- Each session shows the first message and timestamp
- Resume sessions directly or start new ones
- Choose your preferred AI provider for new sessions

### Creating Agents

```
CC Agents → Create Agent → Configure → Execute
```

1. **Design Your Agent**: Set name, icon, and system prompt
2. **Choose AI Provider**: Select Claude Code or Gemini CLI
3. **Configure Model**: Choose between available models for your provider
4. **Set Sandbox Profile**: Apply security restrictions
5. **Execute Tasks**: Run your agent on any project

### Multi-AI Workflows

```
Session → Provider Settings → Switch Provider → Continue Conversation
```

- Start a conversation with one AI provider
- Switch to another provider mid-conversation
- Compare responses from different AI services
- Leverage each provider's unique strengths

### Tracking Usage

```
Menu → Usage Dashboard → View Analytics
```

- Monitor costs by provider, model, project, and date
- Compare usage patterns across Claude and Gemini
- Export data for reports
- Set up usage alerts (coming soon)

### Working with MCP Servers

```
Menu → MCP Manager → Add Server → Configure
```

- Add servers manually or via JSON
- Import from Claude Desktop configuration
- Test connections before using

## 🚀 Installation

### Prerequisites

- **Claude Code CLI**: Install from [Claude's official site](https://claude.ai/code)
- **Gemini CLI**: Install via `npm install -g @google/gemini-cli`
- **API Keys**: Obtain API keys for your preferred AI providers

### Quick Start

**For Linux/macOS:**
```bash
# Clone and start Craig
git clone https://github.com/Nichols-AI/Craig.git
cd Craig
./craig
```

**For Windows:**
```batch
# Clone and start Craig
git clone https://github.com/Nichols-AI/Craig.git
cd Craig
start-craig.bat
```

The simple launcher will:
- Automatically install dependencies if needed
- Start the Craig desktop application
- Launch both frontend and optimized backend

### Download Prebuilt Binaries

**Quick Install (Recommended):**
```bash
curl -sSL https://craig.nicholsai.com/install.sh | bash
```

**Manual Downloads:**
- [Linux (x86_64)](https://github.com/Nichols-AI/Craig/releases/latest/download/craig-linux-x86_64.tar.gz)
- [macOS Intel](https://github.com/Nichols-AI/Craig/releases/latest/download/craig-macos-x86_64.tar.gz)
- [macOS Apple Silicon](https://github.com/Nichols-AI/Craig/releases/latest/download/craig-macos-aarch64.tar.gz)
- [Windows (x86_64)](https://github.com/Nichols-AI/Craig/releases/latest/download/craig-windows-x86_64.zip)

Visit [craig.nicholsai.com](https://craig.nicholsai.com) for the latest downloads and installation instructions.

## 🔨 Build from Source

### Prerequisites

Before building Craig from source, ensure you have the following installed:

#### System Requirements

- **Operating System**: Windows 10/11, macOS 11+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 1GB free space

#### Required Tools

1. **Rust** (1.70.0 or later)
   ```bash
   # Install via rustup
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Bun** (latest version)
   ```bash
   # Install bun
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Git**
   ```bash
   # Usually pre-installed, but if not:
   # Ubuntu/Debian: sudo apt install git
   # macOS: brew install git
   # Windows: Download from https://git-scm.com
   ```

4. **AI Provider CLIs**
   - **Claude Code CLI**: Download from [Claude's official site](https://claude.ai/code)
   - **Gemini CLI**: `npm install -g @google/gemini-cli`
   - Ensure both are available in your PATH

#### Platform-Specific Dependencies

**Linux (Ubuntu/Debian)**
```bash
# Install system dependencies
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libxdo-dev \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev
```

**macOS**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install additional dependencies via Homebrew (optional)
brew install pkg-config
```

**Windows**
- Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (usually pre-installed on Windows 11)

### Build Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Nichols-AI/Craig.git
   cd Craig
   ```

2. **Install Frontend Dependencies**
   ```bash
   bun install
   ```

3. **Build the Application**
   
   **For Development (with hot reload)**
   ```bash
   bun run tauri dev
   ```
   
   **For Production Build**
   ```bash
   # Build the application
   bun run tauri build
   
   # The built executable will be in:
   # - Linux: src-tauri/target/release/bundle/
   # - macOS: src-tauri/target/release/bundle/
   # - Windows: src-tauri/target/release/bundle/
   ```

4. **Platform-Specific Build Options**
   
   **Debug Build (faster compilation, larger binary)**
   ```bash
   bun run tauri build --debug
   ```
   
   **Build without bundling (creates just the executable)**
   ```bash
   bun run tauri build --no-bundle
   ```
   
   **Universal Binary for macOS (Intel + Apple Silicon)**
   ```bash
   bun run tauri build --target universal-apple-darwin
   ```

### Troubleshooting

#### Common Issues

1. **"cargo not found" error**
   - Ensure Rust is installed and `~/.cargo/bin` is in your PATH
   - Run `source ~/.cargo/env` or restart your terminal

2. **Linux: "webkit2gtk not found" error**
   - Install the webkit2gtk development packages listed above
   - On newer Ubuntu versions, you might need `libwebkit2gtk-4.0-dev`

3. **Windows: "MSVC not found" error**
   - Install Visual Studio Build Tools with C++ support
   - Restart your terminal after installation

4. **"claude command not found" error**
   - Ensure Claude Code CLI is installed and in your PATH
   - Test with `claude --version`

5. **"gemini command not found" error**
   - Ensure Gemini CLI is installed: `npm install -g @google/gemini-cli`
   - Test with `gemini --version`

6. **Build fails with "out of memory"**
   - Try building with fewer parallel jobs: `cargo build -j 2`
   - Close other applications to free up RAM

#### Verify Your Build

After building, you can verify the application works:

```bash
# Run the built executable directly
# Linux/macOS
./src-tauri/target/release/craig

# Windows
./src-tauri/target/release/craig.exe
```

### Build Artifacts

The build process creates several artifacts:

- **Executable**: The main Craig application
- **Installers** (when using `tauri build`):
  - `.deb` package (Linux)
  - `.AppImage` (Linux)
  - `.dmg` installer (macOS)
  - `.msi` installer (Windows)
  - `.exe` installer (Windows)

All artifacts are located in `src-tauri/target/release/bundle/`.

## 🛠️ Development

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 6
- **Backend**: Rust with Tauri 2
- **UI Framework**: Tailwind CSS v4 + shadcn/ui
- **Database**: SQLite (via rusqlite)
- **Package Manager**: Bun
- **AI Providers**: Claude Code CLI + Gemini CLI

### Project Structure

```
craig/
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── lib/               # API client & utilities
│   └── assets/            # Static assets
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands/      # Tauri command handlers
│   │   │   ├── claude.rs  # Claude Code integration
│   │   │   ├── gemini.rs  # Gemini CLI integration
│   │   │   └── usage.rs   # Multi-provider analytics
│   │   ├── sandbox/       # Security sandboxing
│   │   ├── checkpoint/    # Timeline management
│   │   └── gemini_binary.rs # Gemini CLI management
│   └── tests/             # Rust test suite
├── docs/                  # Documentation
└── public/                # Public assets
```

### Development Commands

```bash
# Start development server
bun run tauri dev

# Run frontend only
bun run dev

# Type checking
bunx tsc --noEmit

# Run Rust tests
cd src-tauri && cargo test

# Format code
cd src-tauri && cargo fmt
```

### Multi-AI Development

Craig extends the original Claudia architecture with:

- **Provider abstraction**: Unified interface for different AI services
- **Binary management**: Automatic detection and management of AI CLI tools
- **Configuration system**: Provider-specific settings and API keys
- **Usage tracking**: Multi-provider analytics and cost tracking

## 🔒 Security

Craig implements multiple layers of security:

1. **Process Isolation**: Agents run in separate sandboxed processes
2. **Filesystem Access Control**: Whitelist-based file access
3. **Network Restrictions**: Control external connections
4. **Audit Logging**: All security violations are logged
5. **No Data Collection**: Everything stays local on your machine
6. **Credential Security**: Secure storage of API keys for all providers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Areas for Contribution

- 🐛 Bug fixes and improvements
- ✨ New AI provider integrations
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌐 Internationalization
- 📊 Enhanced analytics features

## 📄 License

This project is licensed under the AGPL License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Project**: [Claudia](https://github.com/getAsterisk/claudia) by [Asterisk](https://asterisk.so/) - The foundation that made Craig possible
- Built with [Tauri](https://tauri.app/) - The secure framework for building desktop apps
- [Claude](https://claude.ai) by Anthropic
- [Gemini](https://gemini.google.com) by Google
- The open source community for their amazing tools and libraries

---

<div align="center">
  <p>
    <strong>Forked and enhanced with ❤️ by <a href="https://github.com/Nichols-AI">NicholsAI</a></strong>
  </p>
  <p>
    <strong>Original project by <a href="https://asterisk.so/">Asterisk</a></strong>
  </p>
  <p>
    <a href="https://github.com/Nichols-AI/Craig/issues">Report Bug</a>
    ·
    <a href="https://github.com/Nichols-AI/Craig/issues">Request Feature</a>
  </p>
</div>