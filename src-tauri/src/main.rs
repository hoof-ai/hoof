// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client;
use serde_json::{json, Value};
use tauri::command;
use thiserror::Error;
// Import the command macro for Tauri.
use serde::{ser::Error as SerdeError, Deserialize};
use serde::Serialize; // Add this to bring the `Error` trait into scope.
use tauri::{Builder, Manager, WindowBuilder, WindowUrl};

#[derive(Debug, Serialize)]
struct ModelList {
    models: Vec<String>,
}

#[derive(Debug, Error)]
pub enum ApiError {
    #[error("Network request failed: {0}")]
    Network(reqwest::Error),
    #[error("Failed to parse response: {0}")]
    ParseError(serde_json::Error),
    #[error("Command execution failed: {0}")]
    CommandError(String),
}

// Implement conversion from `ApiError` to `tauri::InvokeError`.
impl From<ApiError> for tauri::InvokeError {
    fn from(error: ApiError) -> Self {
        match error {
            ApiError::Network(e) => tauri::InvokeError::from(e.to_string()), // Convert to string
            ApiError::ParseError(e) => tauri::InvokeError::from(e.to_string()), // Convert to string
            ApiError::CommandError(e) => tauri::InvokeError::from(e),
        }
    }
}

/// Asks Ollama API with a question and model, expecting a string response
#[command]
async fn askollama(question: String, models: String) -> Result<String, ApiError> {
    let url = "http://localhost:11434/api/generate";
    let client = Client::new();
    let res = client
        .post(url)
        .json(&json!({
            "model": models,
            "prompt": question,
            "stream": false
        }))
        .send()
        .await
        .map_err(ApiError::Network)?
        .text()
        .await
        .map_err(ApiError::Network)?;

    let final_response = res
        .lines()
        .filter_map(|line| serde_json::from_str::<Value>(line).ok())
        .filter_map(|val| val.get("response")?.as_str().map(ToString::to_string))
        .collect::<Vec<String>>()
        .join("");

    Ok(final_response)
}

/// Retrieves the list of models from Ollama API
#[command]
fn get_ollama_models() -> Result<ModelList, ApiError> {
    let output = std::process::Command::new("ollama")
        .arg("list")
        .output()
        .map_err(|e| ApiError::CommandError(e.to_string()))?;

    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr).into_owned();
        return Err(ApiError::CommandError(error_message));
    }

    let models = String::from_utf8(output.stdout)
        .map_err(|_| {
            ApiError::ParseError(serde_json::error::Error::custom("Invalid UTF-8 sequence"))
        })?
        .lines()
        // Skip the first line, which is the header
        .skip(1)
        .filter_map(|line| line.split_whitespace().next().map(ToString::to_string))
        .collect();

    Ok(ModelList { models })
}

#[tauri::command]
fn open_chat_window(app: tauri::AppHandle) {
    if app.get_window("chat").is_none() {
        WindowBuilder::new(&app, "chat", WindowUrl::App("chat.html".into()))
            .title("Chat")
            .visible(false) // Start with window not visible
            .build()
            .expect("Failed to build window");
    } else {
        // Optionally, bring the existing window to the front
        let window = app.get_window("chat").unwrap();
        window.set_focus().unwrap();
    }
}

#[tauri::command]
fn open_settings_window(app: tauri::AppHandle) {
    if app.get_window("settings").is_none() {
        WindowBuilder::new(&app, "settings", WindowUrl::App("settings.html".into()))
            .title("Settings")
            .visible(false) // Start with window not visible
            .build()
            .expect("Failed to build window");
    } else {
        // Optionally, bring the existing window to the front
        let window = app.get_window("settings").unwrap();
        window.set_focus().unwrap();
    }
}

// Define a struct for the settings
#[derive(Serialize, Deserialize)]
struct Settings {
    default_model: String,
    hotkey: String,
    open_on_active_display: bool,
    pinning_mode: bool,
    font_size: u8,
    ollama_api_url: String,
    auto_copy_selection: bool,
    auto_copy_clipboard: bool,
    unload_model_idle_minutes: Option<u8>,
    streaming_output: bool,
}

// Tauri commands for getting and setting the settings
#[tauri::command]
fn get_settings() -> Result<Settings, String> {
    // Logic to retrieve settings

    // Return a dummy settings struct for now
    Ok(Settings {
        default_model: "davinci".to_string(),
        hotkey: "ctrl+space".to_string(),
        open_on_active_display: true,
        pinning_mode: false,
        font_size: 16,
        ollama_api_url: "http://localhost:11434".to_string(),
        auto_copy_selection: false,
        auto_copy_clipboard: false,
        unload_model_idle_minutes: None,
        streaming_output: false,
    })
}

#[tauri::command]
fn set_settings(new_settings: Settings) -> Result<(), String> {
    // Logic to save settings

    // return the new settings
    Ok(())
}


mod spotlight;

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![
            spotlight::init_spotlight_window,
            spotlight::show_spotlight,
            spotlight::hide_spotlight,
            askollama,
            get_ollama_models,
            open_chat_window,
            open_settings_window
        ])
        .manage(spotlight::State::default())
        .setup(move |app| {
            // Set activation policy to Accessory to prevent the app icon from showing on the dock
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
