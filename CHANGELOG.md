# Changelog

All notable changes to Craig will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-07-01

### Added
- **Enhanced FilePicker with Crash Prevention**
  - Comprehensive error boundaries to prevent application crashes
  - Smart pagination limiting directory listings to 1000 items max
  - Robust path validation and sanitization for security
  - Advanced error handling for broken symlinks and permission issues
  - Smart caching with TTL (5 minutes) and LRU eviction
  - Timeout handling for long-running file operations

- **Simple Launcher Script**
  - New `./craig` command for easy startup
  - Optimized Rust compilation settings for faster builds
  - Streamlined installation and startup process

### Fixed
- **FilePicker Stability Issues**
  - Fixed crashes when browsing large directories (10k+ files)
  - Resolved memory exhaustion from unbounded directory listings
  - Fixed hanging on problematic directories with special files
  - Prevented path injection vulnerabilities
  - Improved handling of filesystem edge cases

### Improved
- **Performance Optimizations**
  - Faster Rust compilation with optimized development profile
  - Reduced memory usage through smart cache management
  - Better incremental compilation for development builds
  - Enhanced error recovery and graceful fallbacks

- **Gemini Settings UI**
  - Fixed model selection to use correct "gemini-2.0-flash-exp" model
  - Improved dropdown contrast and visibility in dark/light themes
  - Removed outdated model options that don't match CLI
  - Enhanced focus states and accessibility

## [0.1.0] - 2025-07-01

### Added
- **Complete rebranding from Claudia to Craig**
  - New project name and branding across all components
  - Updated configuration files and documentation
  - Maintained backward compatibility with existing features

- **Gemini CLI Integration**
  - Full Google Gemini CLI support alongside Claude Code
  - Automatic binary detection and version checking
  - Support for multiple installation methods (NPM global, system PATH)
  - Gemini API key management and configuration

- **Multi-Provider Usage Analytics**
  - Extended usage tracking to support both Claude and Gemini
  - Provider-specific cost calculations and pricing
  - Unified dashboard showing cross-provider analytics
  - Export functionality for multi-provider billing

- **Enhanced Settings Panel**
  - New Gemini configuration tab with Sparkles icon
  - API key management for Google AI Studio
  - Model selection (gemini-pro, gemini-pro-vision, gemini-ultra)
  - Connection testing and status monitoring
  - Installation status display

- **Unified Architecture**
  - Consistent command patterns between Claude and Gemini
  - Shared UI components and styling
  - Unified error handling and loading states
  - Cross-provider session management

### Technical Improvements
- **Backend (Rust/Tauri)**
  - New `gemini_binary.rs` module for Gemini CLI management
  - Complete `commands/gemini.rs` implementation
  - Extended usage tracking with provider awareness
  - Multi-provider pricing constants and calculations

- **Frontend (React/TypeScript)**
  - TypeScript interfaces for Gemini configuration
  - Complete API client with Gemini endpoints
  - Settings UI integration with form validation
  - Real-time status updates and notifications

### Dependencies
- Added support for `@google/gemini-cli` (0.1.7+)
- Maintained compatibility with existing Claude Code CLI
- No breaking changes to existing dependencies

### Documentation
- Complete project documentation
- API reference for multi-provider integration
- Installation and setup guides
- Development workflow documentation

---

## Previous Versions (Claudia Legacy)

This project was forked from Claudia v0.1.0 and completely rebranded to Craig while maintaining all existing functionality and adding comprehensive Gemini integration.