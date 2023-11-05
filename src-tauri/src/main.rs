// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    println!("Hello, {}!", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn askollama(question: &str) -> String {
    println!("Question, {}!", question);
    format!("Response, {}! From Rust", question)
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, askollama])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}