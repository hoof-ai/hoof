// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use thiserror::Error;
use serde_json::Value;
use reqwest;
use serde::ser::{Serialize, Serializer, SerializeStruct};
use serde::de::Error;

#[derive(Debug)]
struct ModelList {
    models: Vec<String>,
}


#[derive(Debug, Error)]
pub enum ApiError {
    #[error("Network request failed: {0}")]
    Network(#[from] reqwest::Error),
    #[error("Failed to parse response: {0}")]
    ParseError(#[from] serde_json::Error),
    #[error("Command execution failed: {0}")]
    CommandError(String),
    // Add more error types as needed
}

impl Serialize for ApiError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        let mut state = serializer.serialize_struct("ApiError", 2)?;
        state.serialize_field("error", &self.to_string())?;
        state.serialize_field("details", &format!("{:?}", self))?;
        state.end()
    }
}

impl Serialize for ModelList {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        // Start a struct serialization with one field named "models".
        let mut state = serializer.serialize_struct("ModelList", 1)?;
        // Serialize the `models` field.
        state.serialize_field("models", &self.models)?;
        state.end()
    }
}

#[tauri::command]
async fn askollama(question: String, models: String) -> Result<String, ApiError> {
    let url = "http://localhost:11434/api/generate";
    println!("Sending request to {}", url);


    let client = reqwest::Client::new();
    let response = client.post(url)
        .json(&serde_json::json!({
            "model": models,
            "prompt": question,
            "stream": false
        }))
        .send()
        .await?
        .text()
        .await?;

    let final_response = response.lines()
        .filter_map(|line| {
            serde_json::from_str::<Value>(line).ok()?.get("response")?.as_str().map(ToString::to_string)
        })
        .collect::<Vec<String>>()
        .join("");

    Ok(final_response)
}

#[tauri::command]
async fn get_ollama_models() -> Result<ModelList, ApiError> {
    let output = std::process::Command::new("ollama")
        .arg("list")
        .output()
        .map_err(|e| ApiError::CommandError(e.to_string()))?;

    if !output.status.success() {
        return Err(ApiError::CommandError(
            String::from_utf8_lossy(&output.stderr).into_owned(),
        ));
    }

    let output_str = String::from_utf8(output.stdout)
        .map_err(|_| ApiError::ParseError(serde_json::Error::custom("Invalid UTF-8 sequence")))?;

    // Extract only the name part before the first tab or space
    let models = output_str
        .lines()
        .filter_map(|line| line.split_whitespace().next().map(str::to_owned))
        .collect::<Vec<String>>();

    Ok(ModelList { models })
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