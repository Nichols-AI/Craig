use anyhow::Result;
use log::{debug, info, warn};
use serde::{Deserialize, Serialize};
use std::cmp::Ordering;
/// Shared module for detecting Gemini CLI binary installations
/// Supports NPM global installations, local installations, and version-based selection
use std::path::PathBuf;
use std::process::Command;
use tauri::Manager;

/// Represents a Gemini installation with metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeminiInstallation {
    /// Full path to the Gemini binary
    pub path: String,
    /// Version string if available
    pub version: Option<String>,
    /// Source of discovery (e.g., "npm-global", "npm-local", "system", "which")
    pub source: String,
}

/// Main function to find the Gemini binary
/// Checks database first, then discovers all installations and selects the best one
pub fn find_gemini_binary(app_handle: &tauri::AppHandle) -> Result<String, String> {
    info!("Searching for gemini binary...");

    // First check if we have a stored path in the database
    if let Ok(app_data_dir) = app_handle.path().app_data_dir() {
        let db_path = app_data_dir.join("agents.db");
        if db_path.exists() {
            if let Ok(conn) = rusqlite::Connection::open(&db_path) {
                if let Ok(stored_path) = conn.query_row(
                    "SELECT value FROM app_settings WHERE key = 'gemini_binary_path'",
                    [],
                    |row| row.get::<_, String>(0),
                ) {
                    info!("Found stored gemini path in database: {}", stored_path);
                    let path_buf = PathBuf::from(&stored_path);
                    if path_buf.exists() && path_buf.is_file() {
                        return Ok(stored_path);
                    } else {
                        warn!("Stored gemini path no longer exists: {}", stored_path);
                    }
                }
            }
        }
    }

    // Discover all available installations
    let installations = discover_all_gemini_installations();
    
    if installations.is_empty() {
        return Err("No Gemini CLI installations found. Please install with: npm install -g @google/gemini-cli".to_string());
    }

    // Select the best installation (highest version or most reliable source)
    let best_installation = select_best_gemini_installation(&installations);
    
    info!(
        "Selected gemini installation: {} (version: {:?}, source: {})",
        best_installation.path, best_installation.version, best_installation.source
    );

    Ok(best_installation.path.clone())
}

/// Discover all available Gemini installations
pub fn discover_all_gemini_installations() -> Vec<GeminiInstallation> {
    let mut installations = Vec::new();
    
    info!("Discovering Gemini CLI installations...");

    // Check NPM global installation
    if let Some(installation) = check_npm_global_gemini() {
        installations.push(installation);
    }

    // Check system PATH
    if let Some(installation) = check_system_path_gemini() {
        installations.push(installation);
    }

    // Check common installation paths
    installations.extend(check_common_gemini_paths());

    // Remove duplicates based on path
    installations.sort_by(|a, b| a.path.cmp(&b.path));
    installations.dedup_by(|a, b| a.path == b.path);

    info!("Found {} Gemini installations", installations.len());
    for installation in &installations {
        debug!(
            "Gemini installation: {} (version: {:?}, source: {})",
            installation.path, installation.version, installation.source
        );
    }

    installations
}

/// Check for NPM global Gemini installation
fn check_npm_global_gemini() -> Option<GeminiInstallation> {
    debug!("Checking for NPM global Gemini installation...");
    
    // Try to get npm global prefix
    if let Ok(output) = Command::new("npm").args(&["prefix", "-g"]).output() {
        if output.status.success() {
            let prefix = String::from_utf8_lossy(&output.stdout).trim().to_string();
            let gemini_path = PathBuf::from(&prefix).join("bin").join("gemini");
            
            if gemini_path.exists() {
                let version = get_gemini_version(&gemini_path.to_string_lossy());
                return Some(GeminiInstallation {
                    path: gemini_path.to_string_lossy().to_string(),
                    version,
                    source: "npm-global".to_string(),
                });
            }
        }
    }

    None
}

/// Check system PATH for Gemini
fn check_system_path_gemini() -> Option<GeminiInstallation> {
    debug!("Checking system PATH for Gemini...");
    
    if let Ok(output) = Command::new("which").arg("gemini").output() {
        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !path.is_empty() && PathBuf::from(&path).exists() {
                let version = get_gemini_version(&path);
                return Some(GeminiInstallation {
                    path,
                    version,
                    source: "system".to_string(),
                });
            }
        }
    }

    None
}

/// Check common installation paths for Gemini
fn check_common_gemini_paths() -> Vec<GeminiInstallation> {
    let mut installations = Vec::new();
    
    // Common paths where Gemini might be installed
    let common_paths = vec![
        "/usr/local/bin/gemini",
        "/opt/homebrew/bin/gemini",
        "~/.local/bin/gemini",
    ];
    
    for path_str in common_paths {
        let expanded_path = if path_str.starts_with('~') {
            if let Some(home) = dirs::home_dir() {
                home.join(&path_str[2..]).to_string_lossy().to_string()
            } else {
                continue;
            }
        } else {
            path_str.to_string()
        };
        
        let path = PathBuf::from(&expanded_path);
        if path.exists() && path.is_file() {
            let version = get_gemini_version(&expanded_path);
            installations.push(GeminiInstallation {
                path: expanded_path,
                version,
                source: "common-path".to_string(),
            });
        }
    }
    
    installations
}

/// Get Gemini version from binary path
fn get_gemini_version(path: &str) -> Option<String> {
    debug!("Getting version for Gemini at: {}", path);
    
    match Command::new(path).arg("--version").output() {
        Ok(output) => {
            if output.status.success() {
                let version_output = String::from_utf8_lossy(&output.stdout);
                let version = version_output.trim().to_string();
                debug!("Gemini version: {}", version);
                Some(version)
            } else {
                debug!("Failed to get Gemini version: {}", String::from_utf8_lossy(&output.stderr));
                None
            }
        }
        Err(e) => {
            debug!("Error getting Gemini version: {}", e);
            None
        }
    }
}

/// Select the best Gemini installation from available options
fn select_best_gemini_installation(installations: &[GeminiInstallation]) -> &GeminiInstallation {
    if installations.len() == 1 {
        return &installations[0];
    }

    // Priority order: npm-global > system > common-path
    let source_priority = |source: &str| match source {
        "npm-global" => 0,
        "system" => 1,
        "common-path" => 2,
        _ => 999,
    };

    installations
        .iter()
        .min_by(|a, b| {
            let priority_cmp = source_priority(&a.source).cmp(&source_priority(&b.source));
            if priority_cmp != Ordering::Equal {
                return priority_cmp;
            }
            
            // If same priority, prefer the one with version info
            match (&a.version, &b.version) {
                (Some(_), None) => Ordering::Less,
                (None, Some(_)) => Ordering::Greater,
                _ => Ordering::Equal,
            }
        })
        .unwrap_or(&installations[0])
}

/// Store the selected Gemini binary path in database
pub fn store_gemini_binary_path(app_handle: &tauri::AppHandle, path: &str) -> Result<(), String> {
    if let Ok(app_data_dir) = app_handle.path().app_data_dir() {
        let db_path = app_data_dir.join("agents.db");
        if let Ok(conn) = rusqlite::Connection::open(&db_path) {
            // Create settings table if it doesn't exist
            if let Err(e) = conn.execute(
                "CREATE TABLE IF NOT EXISTS app_settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )",
                [],
            ) {
                return Err(format!("Failed to create settings table: {}", e));
            }

            // Store the path
            if let Err(e) = conn.execute(
                "INSERT OR REPLACE INTO app_settings (key, value) VALUES (?1, ?2)",
                rusqlite::params!["gemini_binary_path", path],
            ) {
                return Err(format!("Failed to store Gemini binary path: {}", e));
            }

            info!("Stored Gemini binary path: {}", path);
            Ok(())
        } else {
            Err("Failed to open database".to_string())
        }
    } else {
        Err("Failed to get app data directory".to_string())
    }
}

/// Test if a Gemini binary is working
pub fn test_gemini_binary(path: &str) -> Result<String, String> {
    debug!("Testing Gemini binary at: {}", path);
    
    match Command::new(path).arg("--version").output() {
        Ok(output) => {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
                Ok(version)
            } else {
                Err(format!("Gemini binary test failed: {}", String::from_utf8_lossy(&output.stderr)))
            }
        }
        Err(e) => Err(format!("Failed to execute Gemini binary: {}", e)),
    }
}