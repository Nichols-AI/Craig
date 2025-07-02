use serde::{Deserialize, Serialize};
use std::fs;
use tokio::io::{AsyncBufReadExt, BufReader};
use std::path::PathBuf;
use std::process::Stdio;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};
use tokio::process::{Child, Command};
use tokio::sync::Mutex;

/// Global state to track current Gemini process
pub struct GeminiProcessState {
    pub current_process: Arc<Mutex<Option<Child>>>,
}

impl Default for GeminiProcessState {
    fn default() -> Self {
        Self {
            current_process: Arc::new(Mutex::new(None)),
        }
    }
}

/// Represents the Gemini CLI version status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeminiVersionStatus {
    /// Whether Gemini CLI is installed and working
    pub is_installed: bool,
    /// The version string if available
    pub version: Option<String>,
    /// The full output from the command
    pub output: String,
}

/// Represents Gemini API configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeminiConfig {
    /// API key for Gemini API
    pub api_key: Option<String>,
    /// Selected model (gemini-2.0-flash-exp, etc.)
    pub model: Option<String>,
    /// Project ID for Google Cloud
    pub project_id: Option<String>,
    /// Additional configuration options
    #[serde(flatten)]
    pub extra: serde_json::Value,
}

impl Default for GeminiConfig {
    fn default() -> Self {
        Self {
            api_key: None,
            model: Some("gemini-2.0-flash-exp".to_string()),
            project_id: None,
            extra: serde_json::json!({}),
        }
    }
}

/// Check if Gemini CLI is installed and get version
#[tauri::command]
pub async fn get_gemini_version(app: AppHandle) -> Result<GeminiVersionStatus, String> {
    log::info!("Checking Gemini CLI version");
    
    let gemini_path = crate::gemini_binary::find_gemini_binary(&app)
        .map_err(|e| format!("Gemini CLI not found: {}", e))?;
    
    match crate::gemini_binary::test_gemini_binary(&gemini_path) {
        Ok(version) => {
            log::info!("Gemini CLI version: {}", version);
            Ok(GeminiVersionStatus {
                is_installed: true,
                version: Some(version.clone()),
                output: version,
            })
        }
        Err(e) => {
            log::error!("Gemini CLI test failed: {}", e);
            Ok(GeminiVersionStatus {
                is_installed: false,
                version: None,
                output: e,
            })
        }
    }
}

/// Execute a Gemini CLI command with streaming output
#[tauri::command]
pub async fn execute_gemini_command(
    app: AppHandle,
    prompt: String,
    model: Option<String>,
    project_path: Option<String>,
) -> Result<String, String> {
    log::info!("Executing Gemini command with model: {:?}", model);
    
    let gemini_path = crate::gemini_binary::find_gemini_binary(&app)
        .map_err(|e| format!("Gemini CLI not found: {}", e))?;
    
    let mut cmd = Command::new(&gemini_path);
    
    // Set the model if specified
    if let Some(model) = model {
        cmd.arg("--model").arg(model);
    }
    
    // Set working directory if project path is provided
    if let Some(path) = project_path {
        cmd.current_dir(path);
    }
    
    // Add the prompt as an argument
    cmd.arg(&prompt);
    
    // Configure command for streaming
    cmd.stdout(Stdio::piped())
       .stderr(Stdio::piped());
    
    let mut child = cmd.spawn()
        .map_err(|e| format!("Failed to spawn Gemini process: {}", e))?;
    
    // Store the process in global state
    if let Some(process_state) = app.try_state::<GeminiProcessState>() {
        let mut current_process = process_state.current_process.lock().await;
        
        // Get stdout before storing the process
        let stdout = child.stdout.take()
            .ok_or("Failed to get stdout from Gemini process")?;
        
        *current_process = Some(child);
        drop(current_process);
        
        // Process output
        let reader = BufReader::new(stdout);
        let mut output = String::new();
        let mut lines = reader.lines();
        
        while let Some(line) = lines.next_line().await.map_err(|e| format!("Error reading output: {}", e))? {
            output.push_str(&line);
            output.push('\n');
            
            // Emit streaming output to frontend
            let _ = app.emit("gemini-output", &line);
        }
        
        // Wait for process to complete
        let mut current_process = process_state.current_process.lock().await;
        if let Some(mut process) = current_process.take() {
            let status = process.wait().await
                .map_err(|e| format!("Failed to wait for Gemini process: {}", e))?;
            
            if status.success() {
                Ok(output)
            } else {
                Err(format!("Gemini command failed with status: {}", status))
            }
        } else {
            Ok(output)
        }
    } else {
        Err("Gemini process state not initialized".to_string())
    }
}

/// Stop the currently running Gemini process
#[tauri::command]
pub async fn stop_gemini_process(app: AppHandle) -> Result<(), String> {
    log::info!("Stopping Gemini process");
    
    if let Some(process_state) = app.try_state::<GeminiProcessState>() {
        let mut current_process = process_state.current_process.lock().await;
        
        if let Some(mut process) = current_process.take() {
            process.kill().await
                .map_err(|e| format!("Failed to kill Gemini process: {}", e))?;
            log::info!("Gemini process stopped");
        }
    }
    
    Ok(())
}

/// Get Gemini configuration from settings
#[tauri::command]
pub async fn get_gemini_config(app: AppHandle) -> Result<GeminiConfig, String> {
    let config_path = get_gemini_config_path(&app)?;
    
    if config_path.exists() {
        let content = fs::read_to_string(&config_path)
            .map_err(|e| format!("Failed to read Gemini config: {}", e))?;
        
        let config: GeminiConfig = serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse Gemini config: {}", e))?;
        
        Ok(config)
    } else {
        Ok(GeminiConfig::default())
    }
}

/// Save Gemini configuration to settings
#[tauri::command]
pub async fn save_gemini_config(app: AppHandle, config: GeminiConfig) -> Result<(), String> {
    let config_path = get_gemini_config_path(&app)?;
    
    // Ensure the parent directory exists
    if let Some(parent) = config_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create config directory: {}", e))?;
    }
    
    let content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize Gemini config: {}", e))?;
    
    fs::write(&config_path, content)
        .map_err(|e| format!("Failed to write Gemini config: {}", e))?;
    
    log::info!("Saved Gemini config to: {:?}", config_path);
    Ok(())
}

/// Test Gemini API connection
#[tauri::command]
pub async fn test_gemini_connection(app: AppHandle) -> Result<bool, String> {
    log::info!("Testing Gemini API connection");
    
    let gemini_path = crate::gemini_binary::find_gemini_binary(&app)
        .map_err(|e| format!("Gemini CLI not found: {}", e))?;
    
    // Try a simple test command
    let output = Command::new(&gemini_path)
        .arg("--help")
        .output()
        .await
        .map_err(|e| format!("Failed to test Gemini connection: {}", e))?;
    
    if output.status.success() {
        log::info!("Gemini connection test successful");
        Ok(true)
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        log::error!("Gemini connection test failed: {}", error);
        Err(format!("Gemini connection test failed: {}", error))
    }
}

/// Get available Gemini models
#[tauri::command]
pub async fn get_gemini_models() -> Result<Vec<String>, String> {
    // Return the current supported Gemini model that matches CLI
    Ok(vec![
        "gemini-2.0-flash-exp".to_string(),
    ])
}

/// Helper function to get Gemini config file path
fn get_gemini_config_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app.path().app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    Ok(app_data_dir.join("gemini_config.json"))
}

/// Initialize Gemini process state
pub fn init_gemini_state(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    app.manage(GeminiProcessState::default());
    Ok(())
}