import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface CompilationStatus {
  isCompiling: boolean;
  progress: number;
  currentPackage: string;
  compiledPackages: number;
  totalPackages: number;
  isBackendReady: boolean;
}

/**
 * Hook to detect Rust compilation status
 */
export const useCompilationStatus = () => {
  const [status, setStatus] = useState<CompilationStatus>({
    isCompiling: true,
    progress: 10, // Start with some progress to show immediately
    currentPackage: "serde",
    compiledPackages: 50,
    totalPackages: 835,
    isBackendReady: false
  });

  useEffect(() => {
    let mounted = true;
    let checkInterval: NodeJS.Timeout;

    const checkBackendStatus = async () => {
      try {
        // Try to ping the Tauri backend with a simple command
        const response = await fetch('http://localhost:1420/__tauri_ping__', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          // Try actual API call
          await api.getClaudeSettings();
          
          if (mounted) {
            setStatus(prev => ({
              ...prev,
              isCompiling: false,
              isBackendReady: true,
              progress: 100,
              compiledPackages: prev.totalPackages
            }));
          }
        } else {
          throw new Error('Backend not ready');
        }
      } catch (error) {
        // Backend not ready yet, simulate progress based on time
        if (mounted) {
          setStatus(prev => {
            const elapsed = Date.now() - startTime;
            const estimatedTotal = 8 * 60 * 1000; // 8 minutes estimated
            const timeProgress = Math.min((elapsed / estimatedTotal) * 100, 95);
            
            // Simulate package compilation
            const simulatedPackages = Math.floor((timeProgress / 100) * prev.totalPackages);
            
            return {
              ...prev,
              progress: Math.max(timeProgress, prev.progress), // Never go backwards
              compiledPackages: Math.max(simulatedPackages, prev.compiledPackages),
              currentPackage: getRandomPackageName()
            };
          });
        }
      }
    };

    const startTime = Date.now();
    
    // Initial check
    checkBackendStatus();
    
    // Set up interval to check every 3 seconds
    checkInterval = setInterval(checkBackendStatus, 3000);

    return () => {
      mounted = false;
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, []);

  return status;
};

/**
 * Get a random package name for simulation
 */
const getRandomPackageName = (): string => {
  const packages = [
    "serde", "tokio", "tauri", "reqwest", "anyhow", "chrono", 
    "serde_json", "uuid", "regex", "clap", "syn", "quote",
    "proc-macro2", "futures", "async-trait", "thiserror",
    "log", "env_logger", "dirs", "which", "tempfile",
    "rusqlite", "sha2", "base64", "glob", "walkdir",
    "tauri-plugin-shell", "tauri-plugin-dialog", "headless_chrome"
  ];
  
  return packages[Math.floor(Math.random() * packages.length)];
};