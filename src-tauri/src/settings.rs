use std::sync::Mutex;
use serde::{Serialize, Deserialize};
use serde_json::Value;
use tauri::{command, State, Wry};
use tauri_plugin_store::{Store};

// Define an enum for different types of setting values
#[derive(Debug, Clone, Serialize, Deserialize)]
enum SettingValue {
    Number(i32),
    String(String),
    Boolean(bool),
}

// Define a struct for a setting with a name and a value
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Setting {
    name: String,
    value: SettingValue,
}

// Define a struct for a settings section with a name and a list of settings
#[derive(Debug, Clone, Serialize, Deserialize)]
struct SettingsSection {
    name: String,
    settings: Vec<Setting>,
}

// Define a struct for a settings category with a name and a list of sections
#[derive(Debug, Clone, Serialize, Deserialize)]
struct SettingsCategory {
    name: String,
    sections: Vec<SettingsSection>,
}

// Define the SettingsList as a vector of SettingsCategories
type SettingsList = Vec<SettingsCategory>;

// Function to get the default settings list
fn get_default_settings_list() -> SettingsList {
    vec![
        SettingsCategory {
            name: "General".to_string(),
            sections: vec![
                SettingsSection {
                    name: "User".to_string(),
                    settings: vec![
                        Setting {
                            name: "Name".to_string(),
                            value: SettingValue::String("Anonymous".to_string()),
                        },
                        Setting {
                            name: "Email".to_string(),
                            value: SettingValue::String("bob@example.com".to_string()),
                        },
                    ],
                },
                SettingsSection {
                    name: "Application".to_string(),
                    settings: vec![
                        Setting {
                            name: "Theme".to_string(),
                            value: SettingValue::String("Dark".to_string()),
                        },
                        Setting {
                            name: "Language".to_string(),
                            value: SettingValue::String("English".to_string()),
                        },
                        // Example of a boolean setting
                        Setting {
                            name: "Notifications".to_string(),
                            value: SettingValue::Boolean(true),
                        },
                        // Example of a numeric setting
                        Setting {
                            name: "FontSize".to_string(),
                            value: SettingValue::Number(12),
                        },
                    ],
                },
            ],
        },
        SettingsCategory {
            name: "Stuff".to_string(),
            sections: vec![
                SettingsSection {
                    name: "Stuff 1".to_string(),
                    settings: vec![
                        Setting {
                            name: "Name".to_string(),
                            value: SettingValue::String("Anonymous".to_string()),
                        },
                        Setting {
                            name: "Email".to_string(),
                            value: SettingValue::String("bob@example.com".to_string()),
                        },
                    ],
                },
                SettingsSection {
                    name: "Stuff 2".to_string(),
                    settings: vec![
                        Setting {
                            name: "Theme".to_string(),
                            value: SettingValue::String("Dark".to_string()),
                        },
                        Setting {
                            name: "Language".to_string(),
                            value: SettingValue::String("English".to_string()),
                        },
                        // Example of a boolean setting
                        Setting {
                            name: "Notifications".to_string(),
                            value: SettingValue::Boolean(true),
                        },
                        // Example of a numeric setting
                        Setting {
                            name: "FontSize".to_string(),
                            value: SettingValue::Number(12),
                        },
                    ],
                },
            ],
        }
    ]
}

// Function to serialize a SettingsSection to serde_json::Value
fn serialize_section_to_value(section: &SettingsSection) -> Result<Value, serde_json::Error> {
    serde_json::to_value(section)
}

// Tauri command to get default settings
#[command]
pub fn get_default_settings() -> Result<Value, String> {
    let settings_list = get_default_settings_list();
    serde_json::to_value(settings_list)
        .map_err(|e| e.to_string())
}

pub struct SettingsStore {
    pub store: Mutex<Store<Wry>>,
}

// Tauri command to read a settings value
#[command]
pub fn read_setting(
    state: State<SettingsStore>,
    category: String,
    section: String,
) -> Result<Value, String> {
    let key = make_store_key(category.clone(), section.clone());
    let store = state.store.lock()
        .map_err(|e| e.to_string())?;
    match store.get(&key) {
        Some(value) => Ok(value.clone()),
        None => {
            // Fetch default value if not in store
            let default_settings = get_default_settings_list();
            find_default_value(category.clone(), section.clone(), default_settings)
        }
    }
}

fn find_default_value(category: String, section: String, default_settings: SettingsList) -> Result<Value, String> {
    default_settings
        .into_iter()
        .find(|cat| cat.name == category)
        .and_then(|cat| cat.sections.into_iter().find(|sec| sec.name == section))
        .map(|sec| serde_json::to_value(sec).map_err(|e| e.to_string()))
        .unwrap_or_else(|| Err(format!("No default value found for {}.{}", category, section)))
}

fn make_store_key(category: String, section: String) -> String {
    let key = format!("{}.{}", category, section);
    key
}

// Tauri command to write a settings value
#[command]
pub fn write_setting(
    state: State<SettingsStore>,
    category: String,
    section: String,
    value: Value,
) -> Result<(), String> {
    let key = make_store_key(category.clone(), section.clone());
    let mut store = state.store.lock().map_err(|e| e.to_string())?;
    store.insert(key, value).map_err(|e| e.to_string())
}

#[derive(Serialize)]
pub struct CategorySummary {
    pub name: String,
    pub sections: Vec<String>,
}

#[command]
pub fn get_settings_summary() -> Vec<CategorySummary> {
    let settings_list = get_default_settings_list();
    settings_list.into_iter().map(|category| {
        CategorySummary {
            name: category.name,
            sections: category.sections.into_iter().map(|s| s.name).collect(),
        }
    }).collect()
}

#[derive(Serialize)]
pub struct SettingInfo {
    pub name: String,
    pub value: SettingValue
}

#[command]
pub fn get_section_settings(
    state: State<SettingsStore>,
    category: String,
    section: String,
) -> Result<Vec<SettingInfo>, String> {
    let key = format!("{}.{}", category, section);
    let store = state.store.lock().map_err(|e| e.to_string())?;

    // Retrieve the stored settings for the section if they exist
    let stored_settings: Option<Vec<Setting>> = store.get(&key)
        .and_then(|value| serde_json::from_value(value.clone()).ok());

    // Retrieve the default settings for the section
    let default_settings = get_default_settings_list()
        .into_iter()
        .find(|c| c.name == category)
        .and_then(|c| c.sections.into_iter().find(|s| s.name == section))
        .ok_or_else(|| "Section not found".to_string())?
        .settings;

    // Merge the stored settings with the default settings
    let settings_info = default_settings.into_iter().map(|default_setting| {
        let value = stored_settings
            .as_ref()
            .and_then(|stored|
                stored.iter().find(|s| s.name == default_setting.name)
                    .map(|s| s.value.clone()))
            .unwrap_or(default_setting.value);

        SettingInfo {
            name: default_setting.name,
            value
        }
    }).collect();

    Ok(settings_info)
}
