// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use thiserror::Error;
use serde_json::Value;
use reqwest;
use serde::ser::{Serialize, Serializer, SerializeStruct};

#[derive(Debug, Error)]
pub enum ApiError {
    #[error("Network request failed: {0}")]
    Network(#[from] reqwest::Error),
    #[error("Failed to parse response: {0}")]
    ParseError(#[from] serde_json::Error),
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



// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    println!("Hello, {}!", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn askollama2(question: &str) -> String {
    println!("Question, {}!", question);
    format!("Response, {}! From Rust", question)
}
#[tauri::command]
async fn askollama(question: String) -> Result<String, ApiError> {
    let url = "http://localhost:11434/api/generate";

    let client = reqwest::Client::new();
    let response = client.post(url)
        .json(&serde_json::json!({
            "model": "mistral:latest",
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


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, askollama])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}