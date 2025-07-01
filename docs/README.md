# Craig Documentation

Welcome to the comprehensive documentation for Craig, the multi-AI desktop client that unifies Claude Code and Gemini CLI in a single, powerful interface.

## 📚 Documentation Index

### Getting Started
- **[Installation Guide](./INSTALLATION.md)** - Complete setup instructions for all platforms
- **[Usage Guide](./USAGE.md)** - How to use Craig effectively for development workflows
- **[Configuration Guide](./CONFIGURATION.md)** - Detailed configuration options and settings

### Technical Reference
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation for developers
- **[Development Guide](./DEVELOPMENT.md)** - Contributing and development workflow
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Solve common issues and problems

### Release Information
- **[Changelog](../CHANGELOG.md)** - Version history and release notes

## 🚀 Quick Start

### 1. Installation
```bash
# Clone and build
git clone https://github.com/your-username/craig.git
cd craig
bun install
bun run tauri build
```

### 2. Setup AI Providers
```bash
# Install Claude Code CLI (from official website)
claude --version

# Install Gemini CLI
npm install -g @google/gemini-cli
gemini --version
```

### 3. Configure Craig
1. Launch Craig application
2. Go to Settings → Gemini
3. Add your Google AI Studio API key
4. Test connections for both providers

### 4. Start Using
- Create or open a project
- Start a conversation with either Claude or Gemini
- Switch between providers seamlessly
- Monitor usage and costs in real-time

## 📖 Documentation Structure

### For End Users
- **[Usage Guide](./USAGE.md)** - Primary guide for daily use
- **[Configuration Guide](./CONFIGURATION.md)** - Customize Craig to your needs
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Solve problems quickly

### For Developers
- **[Development Guide](./DEVELOPMENT.md)** - Contributing and extending Craig
- **[API Reference](./API_REFERENCE.md)** - Technical API documentation
- **[Installation Guide](./INSTALLATION.md)** - Building from source

### For System Administrators
- **[Configuration Guide](./CONFIGURATION.md)** - Enterprise deployment
- **[Installation Guide](./INSTALLATION.md)** - System requirements
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - System-level issues

## 🎯 Key Features Documented

### Multi-Provider Support
- **Unified Interface**: Single app for Claude Code and Gemini CLI
- **Seamless Switching**: Change providers mid-conversation
- **Comparative Analysis**: Run same queries on multiple models
- **Cost Optimization**: Choose the best model for each task

### Project Management
- **Project Discovery**: Auto-detect existing Claude Code projects
- **Session Management**: Organize conversations by project and topic
- **Timeline Navigation**: Visual history with branching and restoration
- **Context Preservation**: Maintain context across long conversations

### Usage Analytics
- **Real-time Tracking**: Monitor costs and token usage live
- **Multi-provider Analytics**: Compare usage across Claude and Gemini
- **Detailed Reporting**: Export usage data for analysis
- **Budget Management**: Set alerts and limits

### Advanced Features
- **Custom Agents**: Create specialized AI assistants
- **Sandbox Security**: Secure execution environments
- **Automation Workflows**: Background processing and monitoring
- **Enterprise Integration**: Proxy support, audit logging, team features

## 🔍 Finding Information

### By Topic
| Topic | Primary Document | Additional Resources |
|-------|------------------|---------------------|
| **Installation** | [Installation Guide](./INSTALLATION.md) | [Troubleshooting](./TROUBLESHOOTING.md) |
| **Basic Usage** | [Usage Guide](./USAGE.md) | [Configuration](./CONFIGURATION.md) |
| **Configuration** | [Configuration Guide](./CONFIGURATION.md) | [API Reference](./API_REFERENCE.md) |
| **Development** | [Development Guide](./DEVELOPMENT.md) | [API Reference](./API_REFERENCE.md) |
| **Troubleshooting** | [Troubleshooting Guide](./TROUBLESHOOTING.md) | All other guides |

### By User Type
| User Type | Recommended Reading Order |
|-----------|---------------------------|
| **New User** | Installation → Usage → Configuration |
| **Developer** | Installation → Development → API Reference |
| **Enterprise** | Installation → Configuration → Troubleshooting |
| **Contributor** | Development → API Reference → Usage |

### By Task
| Task | Primary Guide | Section |
|------|---------------|---------|
| **Install Craig** | [Installation Guide](./INSTALLATION.md) | Installation Methods |
| **Add Gemini API Key** | [Configuration Guide](./CONFIGURATION.md) | Provider Configuration |
| **Start First Conversation** | [Usage Guide](./USAGE.md) | Basic Workflows |
| **Create Custom Agent** | [Usage Guide](./USAGE.md) | Advanced Features |
| **Monitor Usage Costs** | [Usage Guide](./USAGE.md) | Usage Analytics |
| **Troubleshoot Issues** | [Troubleshooting Guide](./TROUBLESHOOTING.md) | Quick Diagnostics |
| **Contribute Code** | [Development Guide](./DEVELOPMENT.md) | Development Workflow |
| **Integrate with API** | [API Reference](./API_REFERENCE.md) | Complete API |

## 🆘 Getting Help

### Self-Help Resources
1. **Search this documentation** for your specific issue
2. **Check [Troubleshooting Guide](./TROUBLESHOOTING.md)** for common problems
3. **Review [Configuration Guide](./CONFIGURATION.md)** for setup issues
4. **Consult [API Reference](./API_REFERENCE.md)** for technical questions

### Community Support
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community questions and sharing
- **Discord**: Real-time chat support (if available)

### Reporting Issues
Use the bug report template in [Troubleshooting Guide](./TROUBLESHOOTING.md) when reporting issues.

## 📝 Contributing to Documentation

### How to Contribute
1. **Identify gaps** or unclear sections
2. **Create clear, actionable content**
3. **Follow existing format and style**
4. **Test instructions before submitting**
5. **Submit pull request** with detailed description

### Documentation Standards
- **Clear headings** and table of contents
- **Step-by-step instructions** with code examples
- **Cross-references** to related sections
- **Screenshots** for UI elements where helpful
- **Code blocks** properly formatted and tested

### What Needs Documentation
- [ ] Video tutorials for common workflows
- [ ] More code examples in API reference
- [ ] Deployment guides for specific platforms
- [ ] Integration examples with popular tools
- [ ] Performance tuning guide
- [ ] Security best practices guide

## 🔄 Documentation Updates

This documentation is actively maintained and updated with each Craig release. Key information:

- **Last Updated**: 2025-07-01
- **Craig Version**: 0.1.0
- **Coverage**: Complete feature documentation
- **Status**: Production ready

### Staying Current
- **Watch the repository** for documentation updates
- **Check [Changelog](../CHANGELOG.md)** for new features
- **Review release notes** for breaking changes
- **Subscribe to notifications** for documentation changes

---

**Need something specific?** Use the search function in your browser (Ctrl+F / Cmd+F) to find information quickly across all documentation files.

**Found an issue?** Please [report it](https://github.com/your-username/craig/issues) or contribute a fix directly.