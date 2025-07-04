import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Code, 
  HardDrive,
  Sparkles,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CompilationProgressProps {
  /**
   * Whether compilation is in progress
   */
  isCompiling: boolean;
  /**
   * Current progress (0-100)
   */
  progress?: number;
  /**
   * Current package being compiled
   */
  currentPackage?: string;
  /**
   * Total packages to compile
   */
  totalPackages?: number;
  /**
   * Compiled packages count
   */
  compiledPackages?: number;
  /**
   * Callback when user dismisses the overlay
   */
  onDismiss?: () => void;
}

/**
 * Cool animated compilation progress overlay
 */
export const CompilationProgress: React.FC<CompilationProgressProps> = ({
  isCompiling,
  progress = 0,
  currentPackage = "dependencies",
  totalPackages = 835,
  compiledPackages = 0,
  onDismiss
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Auto-hide after compilation is complete
  useEffect(() => {
    if (!isCompiling && progress >= 100) {
      const timer = setTimeout(() => {
        onDismiss?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCompiling, progress, onDismiss]);

  const progressPercentage = Math.min(Math.max(progress, 0), 100);
  const isComplete = !isCompiling && progress >= 100;

  return (
    <AnimatePresence>
      {(isCompiling || isComplete) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="relative shadow-lg border border-border p-8 max-w-md w-full mx-4 overflow-hidden">
              {/* Subtle rotating symbol background */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <motion.div
                  className="absolute top-4 right-4 rotating-symbol text-muted-foreground/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Header */}
              <div className="relative z-10 text-center mb-6">
                <motion.div
                  animate={{ rotate: isComplete ? 0 : 360 }}
                  transition={{ duration: 2, repeat: isComplete ? 0 : Infinity, ease: "linear" }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4"
                >
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    >
                      <CheckCircle className="h-8 w-8 text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <Terminal className="h-8 w-8 text-primary-foreground" />
                  )}
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold text-foreground mb-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {isComplete ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="rotating-symbol"></span>
                      Craig is Ready!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="rotating-symbol"></span>
                      Building Craig
                    </span>
                  )}
                </motion.h2>
                
                <p className="text-muted-foreground text-sm">
                  {isComplete 
                    ? "Backend compilation complete! Full functionality available."
                    : "Compiling Rust backend for optimal performance..."
                  }
                </p>
              </div>

              {/* Progress Bar */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>{isComplete ? "Complete" : "Progress"}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted mb-2 mx-auto">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-lg font-semibold text-foreground">{compiledPackages}</div>
                  <div className="text-xs text-muted-foreground">Compiled</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted mb-2 mx-auto">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-lg font-semibold text-foreground">{totalPackages}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>

              {/* Current Package */}
              {!isComplete && (
                <motion.div 
                  className="relative z-10 text-center mb-4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Compiling {currentPackage}</span>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="relative z-10 flex gap-3">
                {isComplete ? (
                  <Button
                    onClick={onDismiss}
                    className="flex-1 gap-2"
                    size="default"
                  >
                    <Sparkles className="h-4 w-4" />
                    Start Using Craig
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => setShowDetails(!showDetails)}
                      variant="outline"
                      className="flex-1"
                      size="default"
                    >
                      {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                    <Button
                      onClick={onDismiss}
                      variant="outline"
                      size="default"
                    >
                      Use Frontend Only
                    </Button>
                  </>
                )}
              </div>

              {/* Details Panel */}
              <AnimatePresence>
                {showDetails && !isComplete && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative z-10 mt-4 pt-4 border-t border-border"
                  >
                    <div className="text-xs text-muted-foreground space-y-2">
                      <p><span className="rotating-symbol mr-1"></span>First-time compilation optimizes dependencies</p>
                      <p><span className="rotating-symbol mr-1"></span>Subsequent launches will be much faster</p>
                      <p><span className="rotating-symbol mr-1"></span>Frontend features work immediately</p>
                      <p><span className="rotating-symbol mr-1"></span>Backend needed for Claude/Gemini execution</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};