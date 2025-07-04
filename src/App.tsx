import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Bot, FolderCode, Sparkles } from "lucide-react";
import { api, type Project, type Session, type ClaudeMdFile } from "@/lib/api";
import { OutputCacheProvider } from "@/lib/outputCache";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectList } from "@/components/ProjectList";
import { SessionList } from "@/components/SessionList";
import { Topbar } from "@/components/Topbar";
import { Toast, ToastContainer } from "@/components/ui/toast";
import { CompilationProgress } from "@/components/CompilationProgress";
import { useCompilationStatus } from "@/hooks/useCompilationStatus";

// Lazy load heavy components
const MarkdownEditor = lazy(() => import("@/components/MarkdownEditor"));
const ClaudeFileEditor = lazy(() => import("@/components/ClaudeFileEditor"));
const Settings = lazy(() => import("@/components/Settings"));
const CCAgents = lazy(() => import("@/components/CCAgents"));
const ClaudeCodeSession = lazy(() => import("@/components/ClaudeCodeSession").then(module => ({ default: module.ClaudeCodeSession })));
const UsageDashboard = lazy(() => import("@/components/UsageDashboard"));
const MCPManager = lazy(() => import("@/components/MCPManager"));
const NFOCredits = lazy(() => import("@/components/NFOCredits"));
const ClaudeBinaryDialog = lazy(() => import("@/components/ClaudeBinaryDialog"));

type View = "welcome" | "projects" | "agents" | "editor" | "settings" | "claude-file-editor" | "claude-code-session" | "usage-dashboard" | "mcp";

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

/**
 * Main App component - Manages the Claude directory browser UI
 */
function App() {
  const [view, setView] = useState<View>("welcome");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editingClaudeFile, setEditingClaudeFile] = useState<ClaudeMdFile | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNFO, setShowNFO] = useState(false);
  const [showClaudeBinaryDialog, setShowClaudeBinaryDialog] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showCompilationProgress, setShowCompilationProgress] = useState(true);
  
  // Check compilation status
  const compilationStatus = useCompilationStatus();
  
  // Debug logging
  useEffect(() => {
    console.log('[App] Compilation status:', compilationStatus);
    console.log('[App] Should show overlay:', compilationStatus.isCompiling && showCompilationProgress);
  }, [compilationStatus, showCompilationProgress]);

  // Load projects on mount when in projects view
  useEffect(() => {
    if (view === "projects") {
      loadProjects();
    } else if (view === "welcome") {
      // Reset loading state for welcome view
      setLoading(false);
    }
  }, [view]);

  // Listen for Claude session selection events
  useEffect(() => {
    const handleSessionSelected = (event: CustomEvent) => {
      const { session } = event.detail;
      setSelectedSession(session);
      setView("claude-code-session");
    };

    const handleClaudeNotFound = () => {
      setShowClaudeBinaryDialog(true);
    };

    window.addEventListener('claude-session-selected', handleSessionSelected as EventListener);
    window.addEventListener('claude-not-found', handleClaudeNotFound as EventListener);
    return () => {
      window.removeEventListener('claude-session-selected', handleSessionSelected as EventListener);
      window.removeEventListener('claude-not-found', handleClaudeNotFound as EventListener);
    };
  }, []);

  /**
   * Loads all projects from the ~/.claude/projects directory
   */
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectList = await api.listProjects();
      setProjects(projectList);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Failed to load projects. Please ensure ~/.claude directory exists.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles project selection and loads its sessions
   */
  const handleProjectClick = async (project: Project) => {
    try {
      setLoading(true);
      setError(null);
      const sessionList = await api.getProjectSessions(project.id);
      setSessions(sessionList);
      setSelectedProject(project);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError("Failed to load sessions for this project.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens a new Claude Code session in the interactive UI
   */
  const handleNewSession = async () => {
    setView("claude-code-session");
    setSelectedSession(null);
  };

  /**
   * Opens a new Gemini CLI session in the interactive UI
   */
  const handleNewGeminiSession = async () => {
    // Create a session object with Gemini model preset
    const geminiSession = {
      id: `gemini-${Date.now()}`,
      created_at: Math.floor(Date.now() / 1000),
      path: null,
      model: "gemini-2.5-pro"
    };
    setSelectedSession(geminiSession as any);
    setView("claude-code-session");
  };

  /**
   * Returns to project list view
   */
  const handleBack = () => {
    setSelectedProject(null);
    setSessions([]);
  };

  /**
   * Handles editing a CLAUDE.md file from a project
   */
  const handleEditClaudeFile = (file: ClaudeMdFile) => {
    setEditingClaudeFile(file);
    setView("claude-file-editor");
  };

  /**
   * Returns from CLAUDE.md file editor to projects view
   */
  const handleBackFromClaudeFileEditor = () => {
    setEditingClaudeFile(null);
    setView("projects");
  };

  const renderContent = () => {
    switch (view) {
      case "welcome":
        return (
          <div className="flex items-center justify-center p-4" style={{ height: "100%" }}>
            <div className="w-full max-w-4xl">
              {/* Welcome Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
              >
                <h1 className="text-4xl font-bold tracking-tight">
                  <span className="rotating-symbol"></span>
                  Welcome to Craig
                </h1>
              </motion.div>

              {/* Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* CC Agents Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card 
                    className="h-64 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border border-border/50 shimmer-hover"
                    onClick={() => setView("agents")}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-8">
                      <Bot className="h-16 w-16 mb-4 text-primary" />
                      <h2 className="text-xl font-semibold">CC Agents</h2>
                    </div>
                  </Card>
                </motion.div>

                {/* CC Projects Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card 
                    className="h-64 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border border-border/50 shimmer-hover"
                    onClick={() => setView("projects")}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-8">
                      <FolderCode className="h-16 w-16 mb-4 text-primary" />
                      <h2 className="text-xl font-semibold">CC Projects</h2>
                    </div>
                  </Card>
                </motion.div>

              </div>
            </div>
          </div>
        );

      case "agents":
        return (
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<LoadingFallback />}>
              <CCAgents onBack={() => setView("welcome")} />
            </Suspense>
          </div>
        );

      case "editor":
        return (
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<LoadingFallback />}>
              <MarkdownEditor onBack={() => setView("welcome")} />
            </Suspense>
          </div>
        );
      
      case "settings":
        return (
          <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
            <Suspense fallback={<LoadingFallback />}>
              <Settings onBack={() => setView("welcome")} />
            </Suspense>
          </div>
        );
      
      case "projects":
        return (
          <div className="flex h-full items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl">
              {/* Header with back button */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView("welcome")}
                  className="mb-4"
                >
                  ← Back to Home
                </Button>
                <div className="text-center">
                  <h1 className="text-3xl font-bold tracking-tight">CC Projects</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Browse your Claude Code sessions
                  </p>
                </div>
              </motion.div>

              {/* Error display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive"
                >
                  {error}
                </motion.div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Content */}
              {!loading && (
                <AnimatePresence mode="wait">
                  {selectedProject ? (
                    <motion.div
                      key="sessions"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SessionList
                        sessions={sessions}
                        projectPath={selectedProject.path}
                        onBack={handleBack}
                        onEditClaudeFile={handleEditClaudeFile}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* New session buttons at the top */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-3"
                      >
                        <Button
                          onClick={handleNewSession}
                          size="default"
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          New Claude Code session
                        </Button>
                        <Button
                          onClick={handleNewGeminiSession}
                          size="default"
                          variant="outline"
                          className="w-full border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950"
                        >
                          <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                          New Gemini CLI session
                        </Button>
                      </motion.div>

                      {/* Project list */}
                      {projects.length > 0 ? (
                        <ProjectList
                          projects={projects}
                          onProjectClick={handleProjectClick}
                        />
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-sm text-muted-foreground">
                            No projects found in ~/.claude/projects
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        );
      
      case "claude-file-editor":
        return editingClaudeFile ? (
          <Suspense fallback={<LoadingFallback />}>
            <ClaudeFileEditor
              file={editingClaudeFile}
              onBack={handleBackFromClaudeFileEditor}
            />
          </Suspense>
        ) : null;
      
      case "claude-code-session":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ClaudeCodeSession
              session={selectedSession || undefined}
              onBack={() => {
                setSelectedSession(null);
                setView("projects");
              }}
            />
          </Suspense>
        );
      
      case "usage-dashboard":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UsageDashboard onBack={() => setView("welcome")} />
          </Suspense>
        );
      
      case "mcp":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MCPManager onBack={() => setView("welcome")} />
          </Suspense>
        );
      
      default:
        return null;
    }
  };

  return (
    <OutputCacheProvider>
      <div className="h-screen bg-background flex flex-col">
        {/* Topbar */}
        <Topbar
          onClaudeClick={() => setView("editor")}
          onSettingsClick={() => setView("settings")}
          onUsageClick={() => setView("usage-dashboard")}
          onMCPClick={() => setView("mcp")}
          onInfoClick={() => setShowNFO(true)}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
        
        {/* NFO Credits Modal */}
        {showNFO && (
          <Suspense fallback={<LoadingFallback />}>
            <NFOCredits onClose={() => setShowNFO(false)} />
          </Suspense>
        )}
        
        {/* Claude Binary Dialog */}
        <Suspense fallback={<LoadingFallback />}>
          <ClaudeBinaryDialog
            open={showClaudeBinaryDialog}
            onOpenChange={setShowClaudeBinaryDialog}
            onSuccess={() => {
              setToast({ message: "Claude binary path saved successfully", type: "success" });
              // Trigger a refresh of the Claude version check
              window.location.reload();
            }}
            onError={(message) => setToast({ message, type: "error" })}
          />
        </Suspense>
        
        {/* Toast Container */}
        <ToastContainer>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onDismiss={() => setToast(null)}
            />
          )}
        </ToastContainer>
        
        {/* Compilation Progress Overlay - Always show for testing */}
        <CompilationProgress
          isCompiling={true}
          progress={45}
          currentPackage="tauri-plugin-shell"
          totalPackages={835}
          compiledPackages={376}
          onDismiss={() => setShowCompilationProgress(false)}
        />
      </div>
    </OutputCacheProvider>
  );
}

export default App;
