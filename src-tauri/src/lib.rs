// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// Declare modules
pub mod checkpoint;
pub mod claude_binary;
pub mod gemini_binary;
pub mod commands;
pub mod process;
pub mod sandbox;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
