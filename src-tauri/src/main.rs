// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::Client;
use serde_json::{json, Value};
use thiserror::Error;
use reqwest;
use tauri::command; // Import the command macro for Tauri.
use serde::{Deserialize, Serialize}; // Add this to bring the `Error` trait into scope.

#[derive(Debug, Serialize)]
struct ModelList {
    models: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Model {
    name: String,
    modified_at: String,
    size: u64,
}

#[derive(Serialize, Deserialize, Debug)]
struct ModelsResponse {
    models: Vec<Model>,
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
async fn get_ollama_models() -> Result<ModelList, ApiError> {
    let url = "http://localhost:11434/api/tags";
    let client = Client::new();
    let models_response = client
        .get(url)
        .send()
        .await
        .map_err(ApiError::Network)?
        .json::<ModelsResponse>()
        .await
        .map_err(ApiError::Network)?; // Change this line

    let model_names = models_response.models.into_iter().map(|model| model.name).collect();

    Ok(ModelList { models: model_names })
}


mod spotlight;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            spotlight::init_spotlight_window,
            spotlight::show_spotlight,
            spotlight::hide_spotlight,
            askollama,
            get_ollama_models
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
