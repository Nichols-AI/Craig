import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { 
  X, 
  Folder, 
  File, 
  ArrowLeft,
  FileCode,
  FileText,
  FileImage,
  Search,
  ChevronRight
} from "lucide-react";
import type { FileEntry } from "@/lib/api";
import { cn } from "@/lib/utils";
import { FilePickerErrorBoundary, useFilePickerErrorHandler } from "./FilePickerErrorBoundary";

// Cache entry with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

// Safe cache implementation with TTL and memory limits
class SafeCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_ENTRIES = 100; // Maximum cache entries
  private readonly MAX_MEMORY_MB = 50; // Rough memory limit in MB (reserved for future use)

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    // Update access count for LRU tracking
    entry.accessCount++;
    return entry.data;
  }

  set(key: string, data: T): void {
    // Check memory usage (rough estimate)
    // Note: this.MAX_MEMORY_MB could be used for more sophisticated memory tracking
    if (this.cache.size >= this.MAX_ENTRIES || this.estimateMemoryUsage() > this.MAX_MEMORY_MB) {
      this.evictOldEntries();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1,
    });
  }

  private estimateMemoryUsage(): number {
    // Simple estimation: assume each entry is roughly 1KB
    return (this.cache.size * 1024) / (1024 * 1024); // Convert to MB
  }

  private evictOldEntries(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    // Remove expired entries first
    const expiredKeys = entries
      .filter(([_, entry]) => now - entry.timestamp > this.TTL)
      .map(([key]) => key);

    expiredKeys.forEach(key => this.cache.delete(key));

    // If still too many entries, remove least recently used
    if (this.cache.size >= this.MAX_ENTRIES) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.accessCount - b.accessCount);

      const toRemove = sortedEntries.slice(0, Math.floor(this.MAX_ENTRIES * 0.3));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  size(): number {
    return this.cache.size;
  }
}

// Global caches with TTL and memory management
const globalDirectoryCache = new SafeCache<FileEntry[]>();
const globalSearchCache = new SafeCache<FileEntry[]>();

// Cache cleanup interval
let cacheCleanupInterval: NodeJS.Timeout | null = null;

// Start cache cleanup if not already running
if (!cacheCleanupInterval) {
  cacheCleanupInterval = setInterval(() => {
    // Force cleanup by trying to access a non-existent key
    globalDirectoryCache.get('__cleanup__');
    globalSearchCache.get('__cleanup__');
  }, 60000); // Clean up every minute
}

interface FilePickerProps {
  /**
   * The base directory path to browse
   */
  basePath: string;
  /**
   * Callback when a file/directory is selected
   */
  onSelect: (entry: FileEntry) => void;
  /**
   * Callback to close the picker
   */
  onClose: () => void;
  /**
   * Initial search query
   */
  initialQuery?: string;
  /**
   * Optional className for styling
   */
  className?: string;
}

// File icon mapping based on extension
const getFileIcon = (entry: FileEntry) => {
  if (entry.is_directory) return Folder;
  
  const ext = entry.extension?.toLowerCase();
  if (!ext) return File;
  
  // Code files
  if (['ts', 'tsx', 'js', 'jsx', 'py', 'rs', 'go', 'java', 'cpp', 'c', 'h'].includes(ext)) {
    return FileCode;
  }
  
  // Text/Markdown files
  if (['md', 'txt', 'json', 'yaml', 'yml', 'toml', 'xml', 'html', 'css'].includes(ext)) {
    return FileText;
  }
  
  // Image files
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
    return FileImage;
  }
  
  return File;
};

// Format file size to human readable
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * FilePicker component - File browser with fuzzy search
 * 
 * @example
 * <FilePicker
 *   basePath="/Users/example/project"
 *   onSelect={(entry) => console.log('Selected:', entry)}
 *   onClose={() => setShowPicker(false)}
 * />
 */
export const FilePicker: React.FC<FilePickerProps> = ({
  basePath,
  onSelect,
  onClose,
  initialQuery = "",
  className,
}) => {
  const searchQuery = initialQuery;
  const { handleError } = useFilePickerErrorHandler();
  
  const [currentPath, setCurrentPath] = useState(basePath);
  const [entries, setEntries] = useState<FileEntry[]>(() => 
    searchQuery.trim() ? [] : globalDirectoryCache.get(basePath) || []
  );
  const [searchResults, setSearchResults] = useState<FileEntry[]>(() => {
    if (searchQuery.trim()) {
      const cacheKey = `${basePath}:${searchQuery}`;
      return globalSearchCache.get(cacheKey) || [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pathHistory, setPathHistory] = useState<string[]>([basePath]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isShowingCached, setIsShowingCached] = useState(() => {
    // Check if we're showing cached data on mount
    if (searchQuery.trim()) {
      const cacheKey = `${basePath}:${searchQuery}`;
      return globalSearchCache.has(cacheKey);
    }
    return globalDirectoryCache.has(basePath);
  });
  
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const fileListRef = useRef<HTMLDivElement>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);
  
  // Computed values
  const displayEntries = searchQuery.trim() ? searchResults : entries;
  const canGoBack = pathHistory.length > 1;
  
  // Get relative path for display
  const relativePath = currentPath.startsWith(basePath) 
    ? currentPath.slice(basePath.length) || '/'
    : currentPath;

  // Load directory contents
  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  // Debounced search
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (searchQuery.trim()) {
      const cacheKey = `${basePath}:${searchQuery}`;
      
      // Immediately show cached results if available
      if (globalSearchCache.has(cacheKey)) {
        console.log('[FilePicker] Immediately showing cached search results for:', searchQuery);
        setSearchResults(globalSearchCache.get(cacheKey) || []);
        setIsShowingCached(true);
        setError(null);
      }
      
      // Schedule fresh search after debounce
      searchDebounceRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setIsShowingCached(false);
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery, basePath]);

  // Reset selected index when entries change
  useEffect(() => {
    setSelectedIndex(0);
  }, [entries, searchResults]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const displayEntries = searchQuery.trim() ? searchResults : entries;
      
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
          
        case 'Enter':
          e.preventDefault();
          // Enter always selects the current item (file or directory)
          if (displayEntries.length > 0 && selectedIndex < displayEntries.length) {
            onSelect(displayEntries[selectedIndex]);
          }
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(0, prev - 1));
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(displayEntries.length - 1, prev + 1));
          break;
          
        case 'ArrowRight':
          e.preventDefault();
          // Right arrow enters directories
          if (displayEntries.length > 0 && selectedIndex < displayEntries.length) {
            const entry = displayEntries[selectedIndex];
            if (entry.is_directory) {
              navigateToDirectory(entry.path);
            }
          }
          break;
          
        case 'ArrowLeft':
          e.preventDefault();
          // Left arrow goes back to parent directory
          if (canGoBack) {
            navigateBack();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [entries, searchResults, selectedIndex, searchQuery, canGoBack]);

  // Scroll selected item into view
  useEffect(() => {
    if (fileListRef.current) {
      const selectedElement = fileListRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const loadDirectory = async (path: string) => {
    try {
      console.log('[FilePicker] Loading directory:', path);
      
      // Validate path before proceeding
      if (!path || typeof path !== 'string' || path.trim().length === 0) {
        throw new Error('Invalid directory path provided');
      }
      
      // Check cache first and show immediately
      if (globalDirectoryCache.has(path)) {
        console.log('[FilePicker] Showing cached contents for:', path);
        setEntries(globalDirectoryCache.get(path) || []);
        setIsShowingCached(true);
        setError(null);
      } else {
        // Only show loading if we don't have cached data
        setIsLoading(true);
      }
      
      // Always fetch fresh data in background with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Directory listing timed out after 30 seconds')), 30000);
      });
      
      const contents = await Promise.race([
        api.listDirectoryContents(path),
        timeoutPromise
      ]);
      
      console.log('[FilePicker] Loaded fresh contents:', contents.length, 'items');
      
      // Validate response
      if (!Array.isArray(contents)) {
        throw new Error('Invalid response from directory listing');
      }
      
      // Limit directory size to prevent memory issues
      if (contents.length > 1000) {
        console.warn('[FilePicker] Large directory detected:', contents.length, 'items');
        const limitedContents = contents.slice(0, 1000);
        setError(`Directory contains ${contents.length} items. Showing first 1000 for performance.`);
        globalDirectoryCache.set(path, limitedContents);
        setEntries(limitedContents);
      } else {
        // Cache the results
        globalDirectoryCache.set(path, contents);
        setEntries(contents);
        setError(null);
      }
      
      setIsShowingCached(false);
    } catch (err) {
      console.error('[FilePicker] Failed to load directory:', path, err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to load directory';
      handleError(new Error(`Directory loading failed: ${errorMessage}`));
      
      // Only set error if we don't have cached data to show
      if (!globalDirectoryCache.has(path)) {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    try {
      console.log('[FilePicker] Searching for:', query, 'in:', basePath);
      
      // Validate inputs
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        setSearchResults([]);
        return;
      }
      
      if (!basePath || typeof basePath !== 'string') {
        throw new Error('Invalid base path for search');
      }
      
      // Create cache key that includes both query and basePath
      const cacheKey = `${basePath}:${query}`;
      
      // Check cache first and show immediately
      if (globalSearchCache.has(cacheKey)) {
        console.log('[FilePicker] Showing cached search results for:', query);
        setSearchResults(globalSearchCache.get(cacheKey) || []);
        setIsShowingCached(true);
        setError(null);
      } else {
        // Only show loading if we don't have cached data
        setIsLoading(true);
      }
      
      // Always fetch fresh results in background with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Search timed out after 45 seconds')), 45000);
      });
      
      const results = await Promise.race([
        api.searchFiles(basePath, query),
        timeoutPromise
      ]);
      
      console.log('[FilePicker] Fresh search results:', results.length, 'items');
      
      // Validate response
      if (!Array.isArray(results)) {
        throw new Error('Invalid response from search');
      }
      
      // Results are already limited to 50 in backend, but double-check
      const limitedResults = results.slice(0, 50);
      
      // Cache the results
      globalSearchCache.set(cacheKey, limitedResults);
      
      // Update with fresh results
      setSearchResults(limitedResults);
      setIsShowingCached(false);
      setError(null);
    } catch (err) {
      console.error('[FilePicker] Search failed:', query, err);
      
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      handleError(new Error(`Search failed: ${errorMessage}`));
      
      // Only set error if we don't have cached data to show
      const cacheKey = `${basePath}:${query}`;
      if (!globalSearchCache.has(cacheKey)) {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDirectory = (path: string) => {
    setCurrentPath(path);
    setPathHistory(prev => [...prev, path]);
  };

  const navigateBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = [...pathHistory];
      newHistory.pop(); // Remove current
      const previousPath = newHistory[newHistory.length - 1];
      
      // Don't go beyond the base path
      if (previousPath.startsWith(basePath) || previousPath === basePath) {
        setCurrentPath(previousPath);
        setPathHistory(newHistory);
      }
    }
  };

  const handleEntryClick = (entry: FileEntry) => {
    // Single click always selects (file or directory)
    onSelect(entry);
  };
  
  const handleEntryDoubleClick = (entry: FileEntry) => {
    // Double click navigates into directories
    if (entry.is_directory) {
      navigateToDirectory(entry.path);
    }
  };

  const FilePickerContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "absolute bottom-full mb-2 left-0 z-50",
        "w-[500px] h-[400px]",
        "bg-background border border-border rounded-lg shadow-lg",
        "flex flex-col overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={navigateBack}
              disabled={!canGoBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-mono text-muted-foreground truncate max-w-[300px]">
              {relativePath}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Show loading only if no cached data */}
        {isLoading && displayEntries.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        )}

        {/* Show subtle indicator when displaying cached data while fetching fresh */}
        {isShowingCached && isLoading && displayEntries.length > 0 && (
          <div className="absolute top-1 right-2 text-xs text-muted-foreground/50 italic">
            updating...
          </div>
        )}

        {error && displayEntries.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {!isLoading && !error && displayEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <Search className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              {searchQuery.trim() ? 'No files found' : 'Empty directory'}
            </span>
          </div>
        )}

        {displayEntries.length > 0 && (
          <div className="p-2 space-y-0.5" ref={fileListRef}>
            {displayEntries.map((entry, index) => {
              const Icon = getFileIcon(entry);
              const isSearching = searchQuery.trim() !== '';
              const isSelected = index === selectedIndex;
              
              return (
                <button
                  key={entry.path}
                  data-index={index}
                  onClick={() => handleEntryClick(entry)}
                  onDoubleClick={() => handleEntryDoubleClick(entry)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md",
                    "hover:bg-accent transition-colors",
                    "text-left text-sm",
                    isSelected && "bg-accent"
                  )}
                  title={entry.is_directory ? "Click to select • Double-click to enter" : "Click to select"}
                >
                  <Icon className={cn(
                    "h-4 w-4 flex-shrink-0",
                    entry.is_directory ? "text-blue-500" : "text-muted-foreground"
                  )} />
                  
                  <span className="flex-1 truncate">
                    {entry.name}
                  </span>
                  
                  {!entry.is_directory && entry.size > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(entry.size)}
                    </span>
                  )}
                  
                  {entry.is_directory && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  
                  {isSearching && (
                    <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                      {entry.path.replace(basePath, '').replace(/^\//, '')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <p className="text-xs text-muted-foreground text-center">
          ↑↓ Navigate • Enter Select • → Enter Directory • ← Go Back • Esc Close
        </p>
      </div>
    </motion.div>
  );

  return (
    <FilePickerErrorBoundary>
      {FilePickerContent}
    </FilePickerErrorBoundary>
  );
}; 