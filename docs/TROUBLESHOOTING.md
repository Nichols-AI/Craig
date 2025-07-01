# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with Craig.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Installation Issues](#installation-issues)
- [File Management Issues](#file-management-issues)
- [Provider Connection Problems](#provider-connection-problems)
- [Configuration Issues](#configuration-issues)
- [Performance Problems](#performance-problems)
- [UI and Display Issues](#ui-and-display-issues)
- [Error Messages](#error-messages)
- [Advanced Debugging](#advanced-debugging)
- [Getting Help](#getting-help)

## Quick Diagnostics

### Health Check Procedure

1. **Launch Craig** and go to Settings
2. **Check Provider Status**:
   - Claude Code: Should show "installed" with version
   - Gemini CLI: Should show "installed" with version
3. **Test Connections**:
   - Claude: Test through Settings → General
   - Gemini: Test through Settings → Gemini
4. **Verify Configuration**:
   - API keys are entered correctly
   - Models are available
   - No error messages in status panel

### Quick Fixes

#### Common Solutions That Fix 80% of Issues
```bash
# 1. Restart Craig completely
# Close app, then relaunch

# 2. Verify CLI installations
claude --version
gemini --version

# 3. Check network connectivity
curl -s https://api.anthropic.com
curl -s https://generativelanguage.googleapis.com

# 4. Clear configuration and reconfigure
rm ~/.local/share/craig/gemini_config.json
# Reconfigure through UI

# 5. Update to latest versions
npm update -g @google/gemini-cli
# Update Claude Code through official installer
```

## Installation Issues

### Build Failures

#### "cargo not found"
**Problem**: Rust not installed or not in PATH
```bash
# Solution: Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Verify installation
cargo --version
```

#### "webkit2gtk not found" (Linux)
**Problem**: Missing WebKit development libraries
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev

# If above fails, try older version
sudo apt install libwebkit2gtk-4.0-dev

# Fedora
sudo dnf install webkit2gtk4.0-devel

# Arch Linux
sudo pacman -S webkit2gtk
```

#### "MSVC not found" (Windows)
**Problem**: Missing Microsoft C++ Build Tools
```
Solution:
1. Download Visual Studio Installer
2. Install "C++ Build Tools" workload
3. Restart terminal
4. Try build again
```

#### "out of memory" during build
```bash
# Solution 1: Reduce parallel jobs
cargo build -j 2

# Solution 2: Use debug build (faster)
bun run tauri build --debug

# Solution 3: Increase virtual memory (Windows/Linux)
# Add swap space on Linux:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Runtime Dependencies

#### Missing System Libraries (Linux)
```bash
# Check missing dependencies
ldd ./src-tauri/target/release/craig

# Install common missing libraries
sudo apt install -y \
  libgtk-3-0 \
  libwebkit2gtk-4.1-0 \
  libappindicator3-1 \
  librsvg2-2 \
  libssl3
```

#### WebView2 Issues (Windows)
```
Problem: WebView2 runtime not installed
Solution:
1. Download WebView2 Runtime from Microsoft
2. Install the runtime
3. Restart Craig
```

## File Management Issues

### FilePicker Crashes and Hangs

#### "Application crashes when selecting large directories"
Craig v0.1.1+ includes comprehensive FilePicker improvements that prevent most crashes:

**Automatic Solutions (v0.1.1+):**
- **Smart Pagination**: Directories are automatically limited to 1000 items
- **Error Boundaries**: Crashes are caught and show recovery UI instead of closing the app
- **Memory Management**: Intelligent caching prevents memory exhaustion

**If you're on older version:**
```bash
# Update to latest version
git pull origin main
./craig
```

#### "FilePicker hangs when browsing certain directories"
**Common Causes and Solutions:**

1. **Large directories** (node_modules, target, .git):
   ```bash
   # These are automatically excluded in v0.1.1+
   # For older versions, avoid browsing these directories
   ```

2. **Network mounted filesystems**:
   ```bash
   # Check if directory is network mounted
   df -h /path/to/directory
   
   # Use local paths when possible
   ```

3. **Permission issues**:
   ```bash
   # Check directory permissions
   ls -la /path/to/directory
   
   # Fix permissions if needed
   chmod 755 /path/to/directory
   ```

#### "Path not found" or "Invalid path" errors
**v0.1.1+ includes enhanced path validation:**
- Automatically handles relative vs absolute paths
- Validates against path injection attacks
- Provides clear error messages for invalid paths

**Manual troubleshooting:**
```bash
# Verify path exists and is accessible
ls -la "/path/to/directory"

# Check for special characters
echo "/path/to/directory" | hexdump -C

# Use tab completion to ensure correct path
```

### File Search Issues

#### "Search returns no results"
**Enhanced search in v0.1.1+:**
- Improved fuzzy matching
- Better handling of hidden files
- Automatic exclusion of build directories

**Troubleshooting:**
```bash
# Check file exists in expected location
find /project/root -name "*search-term*" -type f

# Verify directory is accessible
ls -la /project/root
```

#### "Search is too slow"
**Optimizations in v0.1.1+:**
- Maximum 50 results returned
- Smart directory exclusions (node_modules, target, etc.)
- 5-directory depth limit
- Result caching with TTL

### Error Recovery

#### "FilePicker shows error boundary"
Craig v0.1.1+ includes graceful error recovery:

1. **Click "Try Again"** - Often resolves transient issues
2. **Navigate to parent directory** - If specific subdirectory has issues
3. **Clear cache** - In development, restart the app to clear cache
4. **Check logs** - Look for specific error details in console

#### "Memory errors during file operations"
**v0.1.1+ Memory Protections:**
- Automatic pagination prevents loading too many files
- Smart caching with LRU eviction
- TTL cache expiration (5 minutes)
- Memory usage monitoring

**For persistent issues:**
```bash
# Monitor memory usage
htop
# Look for craig process memory consumption

# Restart application to clear cache
./craig
```

## Provider Connection Problems

### Claude Code Issues

#### "claude command not found"
```bash
# Diagnosis
which claude
echo $PATH

# Solutions
# 1. Install Claude Code CLI from https://claude.ai/code
# 2. Add to PATH if installed in custom location
export PATH="/path/to/claude:$PATH"

# 3. Verify installation
claude --version
```

#### Claude authentication failures
```bash
# Check authentication status
claude auth status

# Re-authenticate if needed
claude auth login

# Check for API key issues
# Look in ~/.claude/settings.json for authentication config
```

#### Permission denied errors
```bash
# Check file permissions
ls -la ~/.claude/
chmod 755 ~/.claude/
chmod 644 ~/.claude/settings.json

# Check if Claude directory is accessible
cd ~/.claude/projects/
```

### Gemini CLI Issues

#### "gemini command not found"
```bash
# Diagnosis
which gemini
npm list -g @google/gemini-cli

# Solutions
# 1. Install Gemini CLI
npm install -g @google/gemini-cli

# 2. Check NPM global path
npm config get prefix
# Add to PATH if needed
export PATH="$(npm config get prefix)/bin:$PATH"

# 3. Alternative installation location
npx @google/gemini-cli --version
```

#### API key authentication failures
```bash
# Check API key format
echo $GEMINI_API_KEY
# Should start with "AI..." and be ~40 characters

# Test API key directly
curl -H "x-goog-api-key: $GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1beta/models

# Verify in Craig settings
# Settings → Gemini → API Key field
```

#### Rate limiting issues
```
Problem: "Rate limit exceeded" errors
Solutions:
1. Wait for rate limit reset (1 minute for free tier)
2. Reduce request frequency
3. Upgrade to paid tier for higher limits
4. Check quota usage in Google Cloud Console
```

## Configuration Issues

### Settings Not Saving

#### File permission problems
```bash
# Check config directory permissions
ls -la ~/.local/share/craig/
chmod 755 ~/.local/share/craig/
chmod 644 ~/.local/share/craig/gemini_config.json

# Check disk space
df -h ~/.local/share/craig/
```

#### JSON syntax errors
```bash
# Validate configuration files
cat ~/.local/share/craig/gemini_config.json | jq .
# If invalid JSON, fix syntax or delete file to reset

# Backup and reset if corrupted
cp ~/.local/share/craig/gemini_config.json ~/backup/
rm ~/.local/share/craig/gemini_config.json
# Reconfigure through UI
```

### Provider Detection Failures

#### Binary path issues
```bash
# Manual binary detection
find /usr -name "claude" 2>/dev/null
find /usr -name "gemini" 2>/dev/null
find ~/.nvm -name "gemini" 2>/dev/null

# Check PATH variable
echo $PATH | tr ':' '\n'

# Test manual paths in Craig settings
# Settings → Advanced → Binary Paths
```

#### Version detection problems
```bash
# Test version commands manually
claude --version 2>&1
gemini --version 2>&1

# Check for conflicting installations
which -a claude
which -a gemini
```

## Performance Problems

### Slow Response Times

#### Network latency
```bash
# Test API endpoint latency
ping api.anthropic.com
ping generativelanguage.googleapis.com

# Test with curl timing
curl -w "@curl-format.txt" -o /dev/null -s https://api.anthropic.com

# curl-format.txt content:
#     time_namelookup:  %{time_namelookup}\n
#     time_connect:     %{time_connect}\n
#     time_appconnect:  %{time_appconnect}\n
#     time_total:       %{time_total}\n
```

#### Large context processing
```
Problem: Slow responses with large files
Solutions:
1. Reduce context size in prompts
2. Use file summaries instead of full content
3. Break large tasks into smaller chunks
4. Enable context caching where available
```

#### Memory usage issues
```bash
# Monitor Craig memory usage
ps aux | grep craig
htop -p $(pgrep craig)

# Check available memory
free -h

# Clear cache if needed
# Restart Craig to clear memory
```

### High CPU Usage

#### Background processes
```bash
# Check for runaway processes
ps aux | grep -E "(claude|gemini|craig)"

# Kill stuck processes if needed
pkill -f "claude|gemini"

# Restart Craig
```

#### Large file processing
```
Problem: High CPU when processing large codebases
Solutions:
1. Use .gitignore patterns to exclude large files
2. Process files in smaller batches
3. Enable selective file analysis
4. Use streaming responses instead of bulk processing
```

## UI and Display Issues

### Window and Display Problems

#### Window not appearing
```bash
# Check if process is running
ps aux | grep craig

# Kill and restart if stuck
pkill -f craig
./craig

# Check display environment (Linux)
echo $DISPLAY
export DISPLAY=:0
```

#### UI rendering issues
```
Problem: Blank screen or rendering artifacts
Solutions:
1. Update graphics drivers
2. Restart Craig
3. Clear application cache
4. Check for WebView2 updates (Windows)
5. Try different display scaling
```

#### Theme and styling problems
```
Problem: Incorrect colors or layout
Solutions:
1. Check system theme settings
2. Reset Craig to default theme
3. Clear browser cache (Ctrl+Shift+Del in webview)
4. Update to latest Craig version
```

### Input and Interaction Issues

#### Keyboard shortcuts not working
```
Problem: Shortcuts like Ctrl+C, Ctrl+V not working
Solutions:
1. Check if Craig has focus
2. Try clicking in text area first
3. Check for conflicting system shortcuts
4. Restart Craig
```

#### Copy/paste problems
```
Problem: Cannot copy text from responses
Solutions:
1. Use Ctrl+A to select all, then Ctrl+C
2. Right-click for context menu
3. Check clipboard permissions
4. Try different selection method
```

## Error Messages

### Common Error Messages and Solutions

#### "Failed to initialize database"
```
Cause: Database corruption or permission issues
Solutions:
1. Close Craig completely
2. Backup: cp ~/.local/share/craig/agents.db ~/backup/
3. Delete: rm ~/.local/share/craig/agents.db
4. Restart Craig (will recreate database)
```

#### "Provider CLI not found"
```
Cause: AI CLI not installed or not in PATH
Solutions:
1. Install missing CLI (claude or gemini)
2. Add to PATH if installed elsewhere
3. Specify custom path in Settings → Advanced
```

#### "API request failed"
```
Cause: Network, authentication, or API issues
Diagnosis:
1. Check internet connection
2. Verify API keys are correct
3. Check API service status
4. Test with CLI tools directly

Solutions:
1. Refresh API keys
2. Check rate limits
3. Try again later
4. Contact provider support
```

#### "Session not found"
```
Cause: Session data corruption or missing files
Solutions:
1. Refresh session list
2. Check project directory exists
3. Restore from backup if available
4. Create new session
```

#### "Permission denied"
```
Cause: File system permission issues
Solutions:
1. Check file/directory permissions
2. Run with appropriate user permissions
3. Check if files are in use by other processes
4. Verify Craig has necessary access rights
```

## Advanced Debugging

### Enable Debug Logging

#### Application Logs
```bash
# Set environment variables for detailed logging
export CRAIG_LOG_LEVEL=debug
export RUST_LOG=debug

# Launch with logging
./craig 2>&1 | tee craig.log
```

#### Network Debugging
```bash
# Monitor network requests
sudo tcpdump -i any host api.anthropic.com
sudo tcpdump -i any host generativelanguage.googleapis.com

# Check proxy settings
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

### System Information Collection

#### For Bug Reports
```bash
# Collect system information
cat > debug_info.txt << EOF
=== System Information ===
OS: $(uname -a)
Craig Version: $(./craig --version 2>/dev/null || echo "unknown")
Claude Version: $(claude --version 2>/dev/null || echo "not installed")
Gemini Version: $(gemini --version 2>/dev/null || echo "not installed")
Node Version: $(node --version 2>/dev/null || echo "not installed")
NPM Version: $(npm --version 2>/dev/null || echo "not installed")
Rust Version: $(rustc --version 2>/dev/null || echo "not installed")

=== Environment ===
PATH: $PATH
HOME: $HOME
CONFIG_DIR: ~/.local/share/craig/

=== File Permissions ===
$(ls -la ~/.local/share/craig/ 2>/dev/null || echo "Config directory not found")

=== Process Information ===
$(ps aux | grep -E "(craig|claude|gemini)" | grep -v grep)

=== Network ===
$(curl -s --max-time 5 https://api.anthropic.com >/dev/null && echo "Anthropic API: OK" || echo "Anthropic API: FAIL")
$(curl -s --max-time 5 https://generativelanguage.googleapis.com >/dev/null && echo "Google API: OK" || echo "Google API: FAIL")
EOF

cat debug_info.txt
```

### Performance Profiling

#### CPU and Memory Analysis
```bash
# Profile Craig performance
perf record -g ./craig
perf report

# Memory profiling with valgrind (if available)
valgrind --tool=massif ./craig

# Simple monitoring
while true; do
  ps -p $(pgrep craig) -o pid,ppid,cmd,%mem,%cpu
  sleep 5
done
```

## Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide** thoroughly
2. **Search existing issues** on GitHub
3. **Collect debug information** using the script above
4. **Try the quick fixes** at the top of this guide
5. **Test with minimal configuration** (fresh install)

### Information to Include in Bug Reports

```
Required Information:
- Operating system and version
- Craig version (if installed)
- Steps to reproduce the issue
- Expected vs actual behavior
- Error messages (exact text)
- Debug logs (with debug enabled)
- Configuration files (with sensitive data removed)

Optional but Helpful:
- Screenshots or videos
- System specifications
- Network environment details
- Related software versions
```

### Where to Get Help

1. **GitHub Issues**: Primary support channel
   - Bug reports and feature requests
   - Community discussions
   - Developer responses

2. **Documentation**: Comprehensive guides
   - [Installation Guide](./INSTALLATION.md)
   - [Configuration Guide](./CONFIGURATION.md)
   - [Usage Guide](./USAGE.md)
   - [API Reference](./API_REFERENCE.md)

3. **Community Resources**: 
   - Discord server (if available)
   - Reddit communities
   - Stack Overflow

### Creating Effective Bug Reports

```markdown
## Bug Report Template

### Environment
- OS: [Ubuntu 22.04 / macOS 13.1 / Windows 11]
- Craig Version: [0.1.0]
- Claude CLI: [version or "not installed"]
- Gemini CLI: [version or "not installed"]

### Description
[Clear description of the issue]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Error Messages
```
[Paste exact error messages here]
```

### Debug Logs
```
[Paste relevant debug logs here]
```

### Additional Context
[Any other relevant information]
```

This troubleshooting guide should help you resolve most issues with Craig. If you encounter problems not covered here, please contribute back by documenting the solution for others.