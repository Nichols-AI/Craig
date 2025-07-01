# Installation Guide

This guide covers installing Craig and setting up both Claude Code and Gemini CLI integrations.

## Table of Contents

- [System Requirements](#system-requirements)
- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Post-Installation Setup](#post-installation-setup)
- [Provider Configuration](#provider-configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 11+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 1GB free space
- **Network**: Internet connection for AI API access

### Supported Platforms
- **Linux**: Ubuntu 20.04+, Debian 11+, Fedora 35+, Arch Linux
- **macOS**: macOS 11+ (Big Sur and later)
- **Windows**: Windows 10/11 with WebView2

## Prerequisites

### Required Tools

#### 1. Rust (1.70.0 or later)
```bash
# Install via rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

#### 2. Bun (latest version)
```bash
# Install bun
curl -fsSL https://bun.sh/install | bash
```

#### 3. Node.js (18+ recommended)
```bash
# Via Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

#### 4. Git
```bash
# Usually pre-installed, but if not:
# Ubuntu/Debian: sudo apt install git
# macOS: brew install git  
# Windows: Download from https://git-scm.com
```

### Platform-Specific Dependencies

#### Linux (Ubuntu/Debian)
```bash
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

#### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install additional dependencies via Homebrew (optional)
brew install pkg-config
```

#### Windows
- Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (usually pre-installed on Windows 11)

## Installation Methods

### Method 1: Build from Source (Recommended)

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/craig.git
cd craig
```

#### 2. Install Frontend Dependencies
```bash
bun install
```

#### 3. Build the Application

**For Development (with hot reload):**
```bash
bun run tauri dev
```

**For Production Build:**
```bash
bun run tauri build
```

The built executable will be located in:
- **Linux**: `src-tauri/target/release/bundle/`
- **macOS**: `src-tauri/target/release/bundle/`
- **Windows**: `src-tauri/target/release/bundle/`

#### 4. Platform-Specific Build Options

**Debug Build (faster compilation, larger binary):**
```bash
bun run tauri build --debug
```

**Build without bundling (creates just the executable):**
```bash
bun run tauri build --no-bundle
```

**Universal Binary for macOS (Intel + Apple Silicon):**
```bash
bun run tauri build --target universal-apple-darwin
```

### Method 2: Pre-built Releases (Coming Soon)

Pre-built releases will be available on the GitHub releases page with installers for all supported platforms:
- `.deb` and `.AppImage` for Linux
- `.dmg` installer for macOS  
- `.msi` and `.exe` installer for Windows

## Post-Installation Setup

### 1. Install AI Provider CLIs

#### Claude Code CLI
```bash
# Download and install from Claude's official site
# Visit: https://claude.ai/code
# Ensure `claude` is available in your PATH
claude --version
```

#### Gemini CLI
```bash
# Install via NPM (required for Craig's Gemini integration)
npm install -g @google/gemini-cli

# Verify installation
gemini --version
```

### 2. Verify Installation

Run the built Craig executable:
```bash
# Linux/macOS
./src-tauri/target/release/craig

# Windows
./src-tauri/target/release/craig.exe
```

Craig should launch and detect both CLI installations automatically.

## Provider Configuration

### Claude Code Setup

1. **Launch Craig** and go to **Settings → General**
2. **Claude Installation**: Craig will auto-detect Claude Code installations
3. **API Configuration**: Configure through Claude Code's normal setup process
4. **Test Connection**: Use the built-in connection test

### Gemini CLI Setup

1. **Get API Key**: Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new project or select existing
   - Generate an API key
   - Copy the key securely

2. **Configure in Craig**:
   - Go to **Settings → Gemini**
   - Enter your API key
   - Select default model (gemini-pro recommended)
   - Optionally set Google Cloud Project ID
   - Test the connection

3. **Environment Setup** (Alternative):
   ```bash
   # Set environment variable (optional)
   export GEMINI_API_KEY="your-api-key-here"
   ```

## Verification

### 1. Check Installations
In Craig's Settings panel, verify:
- ✅ Claude Code status shows "installed" with version
- ✅ Gemini CLI status shows "installed" with version  
- ✅ Connection tests pass for both providers

### 2. Test Basic Functionality
1. **Create a test project** or open existing project
2. **Start a Claude session** with a simple prompt
3. **Start a Gemini session** with a simple prompt
4. **Check usage dashboard** for tracking both providers

### 3. Verify Features
- [ ] Project and session management
- [ ] Multi-provider usage analytics
- [ ] Settings save/load correctly
- [ ] Cross-provider cost tracking
- [ ] Model selection for both providers

## Troubleshooting

### Common Issues

#### "cargo not found" error
**Solution**: Ensure Rust is installed and `~/.cargo/bin` is in your PATH
```bash
source ~/.cargo/env
# Or restart your terminal
```

#### Linux: "webkit2gtk not found" error
**Solution**: Install webkit2gtk development packages
```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-dev
# Or for older versions
sudo apt install libwebkit2gtk-4.0-dev
```

#### Windows: "MSVC not found" error
**Solution**: Install Visual Studio Build Tools with C++ support and restart terminal

#### "claude command not found"
**Solution**: Install Claude Code CLI and ensure it's in PATH
```bash
claude --version  # Should work
```

#### "gemini command not found"
**Solution**: Install Gemini CLI via NPM
```bash
npm install -g @google/gemini-cli
gemini --version  # Should work
```

#### Build fails with "out of memory"
**Solutions**:
- Try building with fewer parallel jobs: `cargo build -j 2`
- Close other applications to free up RAM
- Use debug build: `bun run tauri build --debug`

#### API Connection Failures
**Solutions**:
- Verify API keys are correct
- Check internet connection
- Test with `gemini --help` or `claude --version`
- Review firewall/proxy settings

### Build Verification

After building, verify the application works:
```bash
# Test the executable directly
# Linux/macOS
./src-tauri/target/release/craig

# Windows  
./src-tauri/target/release/craig.exe
```

### Performance Optimization

For optimal performance:
1. **Use release builds** for production use
2. **Enable system notifications** for long-running tasks
3. **Configure appropriate usage limits** to manage costs
4. **Monitor resource usage** in large projects

### Getting Help

If you encounter issues:

1. **Check the logs**: Craig outputs detailed logs for debugging
2. **Verify prerequisites**: Ensure all required tools are installed
3. **Test CLIs independently**: Verify `claude` and `gemini` work outside Craig
4. **Review permissions**: Ensure Craig has necessary file system permissions
5. **Submit issues**: Report bugs on the GitHub repository with detailed information

### Development Mode

For development and testing:
```bash
# Run in development mode with hot reload
bun run tauri dev

# Run frontend only (for UI development)
bun run dev

# Run Rust tests
cd src-tauri && cargo test

# Type checking
bunx tsc --noEmit
```

This completes the Craig installation process. You should now have a fully functional multi-AI desktop client ready to work with both Claude Code and Gemini CLI!