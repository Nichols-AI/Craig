#!/bin/bash
# Update craig.nicholsai.com with new release information
# This script updates the download page with the latest release

set -e

# Configuration
WEBSITE_REPO="Nichols-AI/craig-website"
CRAIG_REPO="Nichols-AI/Craig"
WEBSITE_DIR="/tmp/craig-website"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[Website Update]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[Website Update]${NC} $1"
}

# Get latest release information
get_latest_release() {
    curl -s "https://api.github.com/repos/${CRAIG_REPO}/releases/latest"
}

# Update download page
update_download_page() {
    local version="$1"
    local release_data="$2"
    
    log_step "Updating download page for version $version"
    
    # Clone or pull website repository
    if [ -d "$WEBSITE_DIR" ]; then
        cd "$WEBSITE_DIR"
        git pull origin main
    else
        git clone "https://github.com/${WEBSITE_REPO}.git" "$WEBSITE_DIR"
        cd "$WEBSITE_DIR"
    fi
    
    # Update version in download page
    cat > index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Craig - Multi-AI Desktop Client</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body class="bg-gray-900 text-white">
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-gray-800 border-b border-gray-700">
            <div class="container mx-auto px-4 py-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold">C</span>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold">Craig</h1>
                            <p class="text-gray-400 text-sm">Multi-AI Desktop Client</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-400">Latest Version</div>
                        <div class="text-xl font-bold text-blue-400">$version</div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 container mx-auto px-4 py-12">
            <div class="max-w-4xl mx-auto">
                <!-- Hero Section -->
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold mb-4">
                        The Ultimate AI Coding Assistant
                    </h2>
                    <p class="text-xl text-gray-300 mb-8">
                        Seamlessly integrate Claude Code and Gemini CLI with your existing subscriptions
                    </p>
                    <div class="flex flex-wrap justify-center gap-4 mb-8">
                        <div class="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
                            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Claude 4 Sonnet & Opus</span>
                        </div>
                        <div class="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Gemini 2.5 Pro & Flash</span>
                        </div>
                        <div class="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
                            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Beautiful Desktop UI</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Install -->
                <div class="bg-gray-800 rounded-lg p-6 mb-8">
                    <h3 class="text-xl font-bold mb-4">Quick Install</h3>
                    <div class="bg-gray-900 rounded-lg p-4 mb-4">
                        <code class="text-green-400">curl -sSL https://craig.nicholsai.com/install.sh | bash</code>
                    </div>
                    <p class="text-gray-400 text-sm">
                        This will automatically detect your platform and install the latest version of Craig.
                    </p>
                </div>

                <!-- Download Links -->
                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-bold mb-2">🐧 Linux</h3>
                        <p class="text-gray-400 text-sm mb-4">x86_64 (64-bit)</p>
                        <a href="https://github.com/${CRAIG_REPO}/releases/download/$version/craig-linux-x86_64.tar.gz" 
                           class="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors">
                            Download
                        </a>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-bold mb-2">🍎 macOS</h3>
                        <p class="text-gray-400 text-sm mb-4">Intel & Apple Silicon</p>
                        <div class="space-y-2">
                            <a href="https://github.com/${CRAIG_REPO}/releases/download/$version/craig-macos-x86_64.tar.gz" 
                               class="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-center transition-colors">
                                Intel
                            </a>
                            <a href="https://github.com/${CRAIG_REPO}/releases/download/$version/craig-macos-aarch64.tar.gz" 
                               class="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-center transition-colors">
                                Apple Silicon
                            </a>
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-bold mb-2">🪟 Windows</h3>
                        <p class="text-gray-400 text-sm mb-4">x86_64 (64-bit)</p>
                        <a href="https://github.com/${CRAIG_REPO}/releases/download/$version/craig-windows-x86_64.zip" 
                           class="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors">
                            Download
                        </a>
                    </div>
                </div>

                <!-- Features -->
                <div class="bg-gray-800 rounded-lg p-6 mb-8">
                    <h3 class="text-xl font-bold mb-4">Features</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Claude Code integration</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Gemini CLI integration</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Multi-model switching</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span>Session management</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>Project organization</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                <span>Beautiful desktop interface</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Getting Started -->
                <div class="bg-gray-800 rounded-lg p-6">
                    <h3 class="text-xl font-bold mb-4">Getting Started</h3>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                            <div>
                                <h4 class="font-semibold">Install Craig</h4>
                                <p class="text-gray-400 text-sm">Use the quick install command or download manually for your platform</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                            <div>
                                <h4 class="font-semibold">Launch the App</h4>
                                <p class="text-gray-400 text-sm">Run <code class="bg-gray-700 px-2 py-1 rounded">craig</code> from your terminal</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                            <div>
                                <h4 class="font-semibold">Choose Your AI</h4>
                                <p class="text-gray-400 text-sm">Select between Claude Code or Gemini CLI sessions</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                            <div>
                                <h4 class="font-semibold">Start Coding</h4>
                                <p class="text-gray-400 text-sm">Begin your AI-assisted development journey!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-gray-800 border-t border-gray-700">
            <div class="container mx-auto px-4 py-6">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <div class="text-gray-400 text-sm">
                        © 2024 Craig. Built with ❤️ for developers.
                    </div>
                    <div class="flex space-x-4 mt-4 md:mt-0">
                        <a href="https://github.com/${CRAIG_REPO}" class="text-gray-400 hover:text-white transition-colors">
                            GitHub
                        </a>
                        <a href="https://github.com/${CRAIG_REPO}/releases" class="text-gray-400 hover:text-white transition-colors">
                            Releases
                        </a>
                        <a href="https://github.com/${CRAIG_REPO}/issues" class="text-gray-400 hover:text-white transition-colors">
                            Issues
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>
EOF
    
    # Commit and push changes
    git add .
    git commit -m "Update download page for Craig $version" || true
    git push origin main
    
    log_info "Website updated successfully for version $version"
}

# Main function
main() {
    local version="$1"
    
    if [ -z "$version" ]; then
        log_info "Getting latest release information..."
        local release_data
        release_data=$(get_latest_release)
        version=$(echo "$release_data" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    fi
    
    if [ -z "$version" ]; then
        echo "Error: Could not determine version"
        exit 1
    fi
    
    log_info "Updating website for Craig version $version"
    update_download_page "$version" "$release_data"
    
    # Cleanup
    rm -rf "$WEBSITE_DIR"
    
    log_info "Website update completed successfully"
}

# Run main function
main "$@"