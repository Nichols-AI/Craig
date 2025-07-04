#!/bin/bash
# Craig Installer Script
# Install Craig Multi-AI Desktop Client from prebuilt binaries
# Usage: curl -sSL https://craig.nicholsai.com/install.sh | bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO="Nichols-AI/Craig"
INSTALL_DIR="/usr/local/bin"
APP_NAME="craig"
WEBSITE="https://craig.nicholsai.com"

# Functions
log_info() {
    echo -e "${GREEN}[Craig Installer]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[Craig Installer]${NC} $1"
}

log_error() {
    echo -e "${RED}[Craig Installer]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[Craig Installer]${NC} $1"
}

# Detect platform and architecture
detect_platform() {
    local platform=""
    local arch=""
    
    case "$(uname -s)" in
        Linux*)     platform="linux" ;;
        Darwin*)    platform="macos" ;;
        CYGWIN*|MINGW*|MSYS*) platform="windows" ;;
        *)          
            log_error "Unsupported platform: $(uname -s)"
            exit 1
            ;;
    esac
    
    case "$(uname -m)" in
        x86_64|amd64)   arch="x86_64" ;;
        arm64|aarch64)  arch="aarch64" ;;
        *)
            log_error "Unsupported architecture: $(uname -m)"
            exit 1
            ;;
    esac
    
    echo "${platform}-${arch}"
}

# Get latest release version
get_latest_version() {
    local version
    version=$(curl -s "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    
    if [ -z "$version" ]; then
        log_error "Failed to get latest version from GitHub"
        exit 1
    fi
    
    echo "$version"
}

# Download and install Craig
install_craig() {
    local platform_arch="$1"
    local version="$2"
    local download_url=""
    local filename=""
    
    case "$platform_arch" in
        linux-x86_64)
            filename="craig-linux-x86_64.tar.gz"
            ;;
        linux-aarch64)
            # For ARM64 Linux, fallback to x86_64 with emulation warning
            log_warn "ARM64 Linux detected. Installing x86_64 version with emulation."
            filename="craig-linux-x86_64.tar.gz"
            ;;
        macos-x86_64)
            filename="craig-macos-x86_64.tar.gz"
            ;;
        macos-aarch64)
            filename="craig-macos-aarch64.tar.gz"
            ;;
        windows-x86_64)
            filename="craig-windows-x86_64.zip"
            INSTALL_DIR="$HOME/.local/bin"
            ;;
        *)
            log_error "Unsupported platform: $platform_arch"
            log_error "Supported platforms: linux-x86_64, linux-aarch64, macos-x86_64, macos-aarch64, windows-x86_64"
            exit 1
            ;;
    esac
    
    download_url="https://github.com/${REPO}/releases/download/${version}/${filename}"
    
    log_step "Downloading Craig ${version} for ${platform_arch}..."
    
    # Create temporary directory
    local temp_dir
    temp_dir=$(mktemp -d)
    cd "$temp_dir"
    
    # Download the release
    if ! curl -L -o "$filename" "$download_url"; then
        log_error "Failed to download Craig from $download_url"
        exit 1
    fi
    
    log_step "Extracting and installing..."
    
    # Extract based on file type
    if [[ "$filename" == *.tar.gz ]]; then
        tar -xzf "$filename"
    elif [[ "$filename" == *.zip ]]; then
        unzip -q "$filename"
    fi
    
    # Create install directory if it doesn't exist
    if [ ! -d "$INSTALL_DIR" ]; then
        if [ "$INSTALL_DIR" = "/usr/local/bin" ]; then
            sudo mkdir -p "$INSTALL_DIR"
        else
            mkdir -p "$INSTALL_DIR"
        fi
    fi
    
    # Find the executable
    local executable=""
    if [ -f "craig" ]; then
        executable="craig"
    elif [ -f "craig.exe" ]; then
        executable="craig.exe"
    elif [ -f "bundle/macos/Craig.app/Contents/MacOS/Craig" ]; then
        # macOS app bundle
        executable="bundle/macos/Craig.app/Contents/MacOS/Craig"
        # Also copy the entire app bundle
        if [ "$platform_arch" = "macos-x86_64" ] || [ "$platform_arch" = "macos-aarch64" ]; then
            sudo cp -R "bundle/macos/Craig.app" "/Applications/"
            log_info "Craig.app installed to /Applications/"
        fi
    else
        log_error "Could not find Craig executable in the downloaded package"
        ls -la
        exit 1
    fi
    
    # Install the executable
    if [ "$INSTALL_DIR" = "/usr/local/bin" ]; then
        sudo cp "$executable" "$INSTALL_DIR/$APP_NAME"
        sudo chmod +x "$INSTALL_DIR/$APP_NAME"
    else
        cp "$executable" "$INSTALL_DIR/$APP_NAME"
        chmod +x "$INSTALL_DIR/$APP_NAME"
    fi
    
    # Cleanup
    cd - > /dev/null
    rm -rf "$temp_dir"
    
    log_info "Craig installed successfully to $INSTALL_DIR/$APP_NAME"
}

# Add to PATH if necessary
update_path() {
    local shell_rc=""
    
    # Detect shell and appropriate RC file
    case "$SHELL" in
        */bash) shell_rc="$HOME/.bashrc" ;;
        */zsh)  shell_rc="$HOME/.zshrc" ;;
        */fish) shell_rc="$HOME/.config/fish/config.fish" ;;
        *)      shell_rc="$HOME/.profile" ;;
    esac
    
    # Check if install directory is in PATH
    if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        log_step "Adding $INSTALL_DIR to PATH in $shell_rc"
        
        if [ "$SHELL" = */fish ]; then
            echo "set -gx PATH $INSTALL_DIR \$PATH" >> "$shell_rc"
        else
            echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$shell_rc"
        fi
        
        log_warn "Please restart your terminal or run: source $shell_rc"
    fi
}

# Verify installation
verify_installation() {
    if command -v "$APP_NAME" >/dev/null 2>&1; then
        log_info "Installation verified! Craig is ready to use."
        log_info "Run 'craig' to start the application."
        return 0
    else
        if [ -f "$INSTALL_DIR/$APP_NAME" ]; then
            log_warn "Craig installed but not in PATH. Please restart your terminal."
            return 0
        else
            log_error "Installation verification failed."
            return 1
        fi
    fi
}

# Show usage information
show_usage() {
    cat << EOF

${GREEN}Craig Multi-AI Desktop Client${NC}

Craig is now installed! Here's what you can do:

${BLUE}Basic Usage:${NC}
  craig                 # Start Craig with GUI
  craig --help          # Show help information
  craig --version       # Show version information

${BLUE}Features:${NC}
  ✅ Claude Code integration with your existing subscription
  ✅ Gemini CLI integration with your existing subscription  
  ✅ Multi-AI model switching (Claude 4, Gemini 2.5 Pro)
  ✅ Session management and project organization
  ✅ Beautiful desktop interface

${BLUE}Getting Started:${NC}
  1. Run 'craig' to launch the application
  2. Choose between Claude Code or Gemini CLI sessions
  3. Select your preferred AI model
  4. Start coding with AI assistance!

${BLUE}Learn More:${NC}
  Website: ${WEBSITE}
  Documentation: ${WEBSITE}/docs
  GitHub: https://github.com/${REPO}

${GREEN}Happy coding with Craig! 🚀${NC}

EOF
}

# Main installation process
main() {
    log_info "Installing Craig Multi-AI Desktop Client..."
    
    # Check if running as root (not recommended)
    if [ "$EUID" -eq 0 ]; then
        log_warn "Running as root. Craig will be installed system-wide."
    fi
    
    # Detect platform
    local platform_arch
    platform_arch=$(detect_platform)
    log_step "Detected platform: $platform_arch"
    
    # Get latest version
    local version
    version=$(get_latest_version)
    log_step "Latest version: $version"
    
    # Install Craig
    install_craig "$platform_arch" "$version"
    
    # Update PATH if necessary (only for non-root installs)
    if [ "$EUID" -ne 0 ] && [ "$INSTALL_DIR" != "/usr/local/bin" ]; then
        update_path
    fi
    
    # Verify installation
    if verify_installation; then
        show_usage
    else
        log_error "Installation completed but verification failed."
        log_error "You may need to restart your terminal or check your PATH."
        exit 1
    fi
}

# Check for help flag
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "Craig Installer"
    echo "Usage: curl -sSL https://craig.nicholsai.com/install.sh | bash"
    echo ""
    echo "Environment variables:"
    echo "  INSTALL_DIR  - Custom installation directory (default: /usr/local/bin)"
    echo ""
    echo "Example:"
    echo "  INSTALL_DIR=~/.local/bin curl -sSL https://craig.nicholsai.com/install.sh | bash"
    exit 0
fi

# Allow custom install directory
if [ -n "$INSTALL_DIR_OVERRIDE" ]; then
    INSTALL_DIR="$INSTALL_DIR_OVERRIDE"
fi

# Run main installation
main "$@"