# Craig Development Plan 
## Claude → Claudia → Craig: The Multi-AI Evolution

This document outlines the complete plan for transforming Claudia into Craig by adding Gemini CLI support while preserving all existing Claude functionality.

## 🎯 Project Overview

**Goal**: Add Google Gemini CLI integration to Claudia and rebrand as "Craig" - a multi-AI development command center.

**Philosophy**: 
- ✅ **Zero Breaking Changes** - All existing Claude functionality remains untouched
- ✅ **Additive Only** - New features built alongside existing ones  
- ✅ **Seamless Upgrade** - Existing users get enhanced capabilities without disruption
- ✅ **Future-Ready** - Architecture that can easily support additional AI providers

## 🏗️ Technical Architecture

### Backend Structure (Rust/Tauri)
```
src-tauri/src/
├── claude_binary.rs          # ✅ Existing - NO CHANGES
├── gemini_binary.rs          # 🆕 NEW - Parallel implementation
├── commands/
│   ├── claude.rs             # ✅ Existing - NO CHANGES  
│   ├── gemini.rs             # 🆕 NEW - Parallel commands
│   └── providers.rs          # 🆕 NEW - Provider management
├── models/
│   ├── claude_types.rs       # ✅ Existing - NO CHANGES
│   └── gemini_types.rs       # 🆕 NEW - Gemini data structures
└── auth/
    ├── claude_auth.rs        # ✅ Existing - NO CHANGES (if exists)
    └── gemini_auth.rs        # 🆕 NEW - Google OAuth integration
```

### Frontend Structure (TypeScript/React)
```
src/
├── components/
│   ├── claude/               # ✅ Existing Claude components - NO CHANGES
│   │   ├── ClaudeInterface.tsx
│   │   ├── ClaudeSettings.tsx
│   │   └── ClaudeVersionSelector.tsx
│   ├── gemini/               # 🆕 NEW - Gemini components
│   │   ├── GeminiInterface.tsx
│   │   ├── GeminiAuth.tsx
│   │   ├── GeminiSettings.tsx
│   │   └── GeminiVersionSelector.tsx
│   └── providers/            # 🆕 NEW - Multi-provider components
│       ├── ProviderSelector.tsx
│       ├── UnifiedInterface.tsx
│       └── ProviderComparison.tsx
├── lib/
│   ├── api.ts                # ✅ Existing - Extend but don't break
│   ├── gemini-api.ts         # 🆕 NEW - Gemini API layer
│   └── providers.ts          # 🆕 NEW - Provider abstraction
```

## 🔧 Implementation Plan

### Phase 1: Gemini CLI Discovery & Basic Integration
**Estimated Time**: 3-4 days

#### 1.1 Gemini Binary Discovery (`gemini_binary.rs`)
```rust
pub struct GeminiInstallation {
    pub path: String,
    pub version: Option<String>,
    pub source: String,        // "npm-global", "system", "PATH", etc.
    pub node_version: Option<String>,
}

// Discovery methods (following Claude patterns)
pub fn discover_gemini_installations() -> Vec<GeminiInstallation>
pub fn find_gemini_binary(app_handle: &tauri::AppHandle) -> Result<String, String>
```

**Discovery Locations:**
- `npm list -g @google/gemini-cli --depth=0` (preferred)
- `which gemini` command
- `~/.npm/bin/gemini` (npm global)
- `/usr/local/bin/gemini` (system install)
- NVM paths: `~/.nvm/versions/node/*/bin/gemini`
- Standard Node.js global paths
- System PATH lookup

#### 1.2 Basic Command Execution (`commands/gemini.rs`)
```rust
// Core execution functions
#[tauri::command]
pub async fn execute_gemini_code(
    app: AppHandle,
    project_path: String, 
    prompt: String, 
    model: String
) -> Result<String, String>

#[tauri::command]
pub async fn list_gemini_installations() -> Result<Vec<GeminiInstallation>, String>

#[tauri::command]
pub async fn check_gemini_version() -> Result<GeminiVersionStatus, String>
```

#### 1.3 Database Extensions (Additive Only)
```sql
-- New tables for Gemini (existing schema unchanged)
CREATE TABLE IF NOT EXISTS gemini_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS gemini_installations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    version TEXT,
    source TEXT,
    node_version TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS user_preferences (
    key TEXT PRIMARY KEY,
    value TEXT
);
```

### Phase 2: Authentication & Session Management
**Estimated Time**: 4-5 days

#### 2.1 Google OAuth Integration (`auth/gemini_auth.rs`)
```rust
pub struct GeminiAuth {
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub expires_at: Option<i64>,
    pub user_email: Option<String>,
}

#[tauri::command]
pub async fn initiate_gemini_auth() -> Result<String, String> // Returns auth URL

#[tauri::command]
pub async fn complete_gemini_auth(auth_code: String) -> Result<GeminiAuth, String>

#[tauri::command]
pub async fn check_gemini_auth_status() -> Result<GeminiAuth, String>
```

#### 2.2 Gemini Session Management
```rust
pub struct GeminiSession {
    pub id: String,
    pub project_id: String,
    pub project_path: String,
    pub model: String,
    pub created_at: u64,
    pub last_activity: u64,
    pub status: SessionStatus,
}

#[tauri::command]
pub async fn create_gemini_session(project_path: String) -> Result<String, String>

#[tauri::command]
pub async fn get_gemini_session_output(session_id: String) -> Result<Vec<OutputMessage>, String>
```

#### 2.3 Database Schema for Auth & Sessions
```sql
CREATE TABLE IF NOT EXISTS gemini_auth (
    id INTEGER PRIMARY KEY,
    access_token TEXT,
    refresh_token TEXT,
    expires_at INTEGER,
    user_email TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS gemini_sessions (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    project_path TEXT,
    model TEXT,
    created_at INTEGER,
    last_activity INTEGER,
    status TEXT DEFAULT 'active',
    metadata TEXT -- JSON for additional data
);
```

### Phase 3: Frontend Integration
**Estimated Time**: 5-6 days

#### 3.1 Gemini API Layer (`lib/gemini-api.ts`)
```typescript
export interface GeminiInstallation {
  path: string;
  version?: string;
  source: string;
  nodeVersion?: string;
}

export interface GeminiSession {
  id: string;
  projectId: string;
  projectPath: string;
  model: string;
  createdAt: number;
  lastActivity: number;
  status: 'active' | 'completed' | 'error';
}

export interface GeminiAuth {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  userEmail?: string;
}

// API Methods
export async function listGeminiInstallations(): Promise<GeminiInstallation[]>
export async function executeGeminiCode(projectPath: string, prompt: string, model: string): Promise<void>
export async function authenticateGemini(): Promise<string> // Returns auth URL
export async function completeGeminiAuth(authCode: string): Promise<GeminiAuth>
export async function checkGeminiAuthStatus(): Promise<GeminiAuth>
```

#### 3.2 Gemini UI Components

**`components/gemini/GeminiInterface.tsx`**
```tsx
export function GeminiInterface() {
  return (
    <div className="gemini-interface">
      <GeminiModelSelector />
      <GeminiAuthStatus />
      <GeminiProjectSelector />
      <GeminiChatInterface />
      <GeminiUsageStats />
    </div>
  );
}
```

**`components/gemini/GeminiAuth.tsx`**
```tsx
export function GeminiAuth() {
  const [authStatus, setAuthStatus] = useState<GeminiAuth | null>(null);
  
  const handleAuth = async () => {
    const authUrl = await authenticateGemini();
    // Open auth URL in browser
    // Handle OAuth callback
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Gemini Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        {authStatus?.accessToken ? (
          <AuthenticatedView user={authStatus} />
        ) : (
          <AuthenticationFlow onAuth={handleAuth} />
        )}
      </CardContent>
    </Card>
  );
}
```

#### 3.3 Provider Selection Interface
```tsx
export function ProviderSelector() {
  const [activeProvider, setActiveProvider] = useState<'claude' | 'gemini'>('claude');
  
  return (
    <div className="provider-selector">
      <Tabs value={activeProvider} onValueChange={setActiveProvider}>
        <TabsList>
          <TabsTrigger value="claude">🤖 Claude Code</TabsTrigger>
          <TabsTrigger value="gemini">🔷 Gemini</TabsTrigger>
          <TabsTrigger value="unified">🔄 Multi-AI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="claude">
          <ClaudeInterface /> {/* Existing component unchanged */}
        </TabsContent>
        
        <TabsContent value="gemini">
          <GeminiInterface /> {/* New component */}
        </TabsContent>
        
        <TabsContent value="unified">
          <UnifiedInterface /> {/* New multi-provider interface */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### Phase 4: Craig Rebranding
**Estimated Time**: 2-3 days

#### 4.1 Branding Assets Update
- **App Name**: Claudia → Craig
- **Logo**: New Craig identity (tech-savvy, multi-AI theme)
- **Colors**: Modern developer palette (blues, greens, tech colors)
- **Tagline**: "Your Multi-AI Development Command Center"

#### 4.2 Configuration Updates
```json
// tauri.conf.json
{
  "package": {
    "productName": "Craig",
    "version": "2.0.0"
  },
  "tauri": {
    "windows": [
      {
        "title": "Craig - Multi-AI Development Assistant",
        "width": 1400,
        "height": 900
      }
    ]
  }
}
```

```json
// package.json
{
  "name": "craig",
  "version": "2.0.0",
  "description": "Multi-AI development assistant with Claude and Gemini support",
  "productName": "Craig"
}
```

#### 4.3 UI/UX Updates
- Update all references from "Claudia" to "Craig"
- New welcome screen showcasing multi-AI capabilities
- Updated about dialog and credits
- New icon set and visual theme

### Phase 5: Advanced Features
**Estimated Time**: 4-5 days

#### 5.1 Unified Multi-AI Interface
```tsx
export function UnifiedInterface() {
  return (
    <div className="unified-interface">
      <ProviderComparison />
      <ParallelExecution />
      <ConversationMerging />
      <CrossProviderAnalytics />
    </div>
  );
}
```

#### 5.2 Provider Comparison & Analytics
- Side-by-side AI response comparison
- Performance metrics (speed, accuracy, cost)
- Usage analytics across providers
- Smart provider recommendations

#### 5.3 Advanced Automation
- Multi-provider agent workflows
- Automatic provider selection based on task type
- Cross-AI conversation threading
- Enhanced checkpoint system for multi-provider sessions

## 🔄 User Experience Evolution

### Current Claudia Experience
```
┌─ Claudia ─────────────────────┐
│ 🤖 Claude Code Projects       │
│ 🤖 Claude Code Agents         │
│ ⚙️ Settings                   │
└───────────────────────────────┘
```

### New Craig Experience
```
┌─ Craig ───────────────────────┐
│ 📁 Projects                   │
│   └─ Multi-AI sessions        │
│ 🤖 AI Providers               │
│   ├─ Claude Code Pro ✅       │
│   └─ Google Gemini ✅         │
│ 🚀 Agents & Automation        │
│ 📊 Usage & Analytics          │
│ ⚙️ Settings                   │
└───────────────────────────────┘
```

### Enhanced Project View
```
Project: my-web-app
├─ 💬 AI Conversations
│  ├─ 🤖 Claude Session (Active)
│  ├─ 🔷 Gemini Session  
│  └─ 🔄 Comparison View
├─ 📁 Files & Structure
├─ 🎯 Agents & Tasks
├─ ⚙️ Settings
└─ 📊 Multi-AI Usage Stats
```

## 🎛️ Migration Strategy

### For Existing Claudia Users
1. **Seamless Update**: All existing functionality works identically
2. **New Discovery**: Users see new Gemini tab and enhanced features
3. **Gradual Adoption**: Can explore Gemini without disrupting Claude workflow
4. **Enhanced Capabilities**: Multi-AI features become available

### For New Craig Users
1. **Onboarding**: Welcome screen offers setup for both Claude and Gemini
2. **Provider Choice**: Can choose primary provider or use both
3. **Unified Experience**: Single interface for all AI interactions
4. **Smart Defaults**: Craig suggests optimal AI for different tasks

## 📊 Success Metrics

### Technical Metrics
- ✅ Zero breaking changes to existing Claude functionality
- ✅ Successful Gemini CLI integration
- ✅ Working OAuth authentication flow
- ✅ Multi-provider session management
- ✅ Complete rebrand to Craig

### User Experience Metrics
- Existing users can access all previous functionality
- New users can successfully set up both providers
- Multi-AI workflows function correctly
- Performance remains optimal

### Feature Completeness
- [x] Gemini binary discovery
- [x] Gemini command execution  
- [x] Google OAuth integration
- [x] Multi-provider UI
- [x] Craig rebranding
- [x] Documentation updates

## 🚀 Launch Strategy

### Beta Release (Craig 2.0.0-beta)
1. Internal testing with preserved Claudia functionality
2. Gemini integration testing
3. Rebranding validation

### Production Release (Craig 2.0.0)
1. Full feature rollout
2. Migration guide for Claudia users
3. New user onboarding documentation
4. Community announcement

## 🔮 Future Roadmap

### Craig 2.1+
- OpenAI ChatGPT integration
- Anthropic Claude API (separate from CLI)
- Azure OpenAI support
- Custom AI provider plugins

### Craig 3.0+
- Multi-AI agent orchestration
- Advanced workflow automation
- Team collaboration features
- Enterprise deployment options

---

**This plan transforms Claudia into Craig while honoring the existing codebase and user experience. Every change is additive, ensuring a smooth evolution from single-AI to multi-AI capabilities.**

**Claude → Claudia → Craig: The evolution continues!** 🚀