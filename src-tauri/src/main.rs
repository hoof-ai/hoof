// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client;
use serde::Serialize;
use serde_json::{json, Value};
use thiserror::Error;
use tauri::command; // Import the command macro for Tauri.
use serde::ser::Error as SerdeError; // Add this to bring the `Error` trait into scope.

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

/// Greet the user with a personalized message
#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Asks Ollama API with a question and model, expecting a string response
#[command]
async fn askollama(question: String, models: String) -> Result<String, ApiError> {
    let url = "http://localhost:11434/api/generate";
    let client = Client::new();
    let res = client.post(url)
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

    let final_response = res.lines()
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
        .map_err(|_| ApiError::ParseError(serde_json::error::Error::custom("Invalid UTF-8 sequence")))?
        .lines()
        .filter_map(|line| line.split_whitespace().next().map(ToString::to_string))
        .collect();

    Ok(ModelList { models })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, askollama, get_ollama_models])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
