import React, { useState, useEffect, ChangeEvent } from "react";
import ReactDOM from "react-dom/client";
import "../../styles.css";
import { useModels } from "../../hooks/useModels";
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { appConfigDir, join } from '@tauri-apps/api/path';

const Settings = () => {
    // Use the custom hook to get the models
    const { availableModels } = useModels();
    const [settings, setSettings] = useState({
        defaultModel: '',
        hotkey: '',
        openOnActiveDisplay: true,
        pinningMode: false,
        fontSize: 12,
        ollamaApiUrl: 'http://localhost:5000',
        autoCopySelection: false,
        autoCopyClipboard: false,
        unloadModelIdleMinutes: 0,
        streamingOutput: false,
    });
    async function getConfigPath() {
        const appDirectory = await appConfigDir();
        return join(appDirectory, 'config.json');
    }

    async function setupAppWindow() {
        const appWindow = (await import('@tauri-apps/api/window')).appWindow;
        return appWindow.show();
    }

    useEffect(() => {
        setupAppWindow().then(loadSettings);
    }, []);


        // Function to load settings from the config file
        async function loadSettings() {
        try {
            const configPath = await getConfigPath();
            const config = await readTextFile(configPath);

            const parsedConfig = JSON.parse(config);
            setSettings(currentSettings => ({ ...currentSettings, ...parsedConfig }));
        } catch (error) {
            console.error('Failed to read config file', error);
        }
    };

    // Function to save settings to the config file
    const saveSettings = async (newSettings: { defaultModel: string; hotkey: string; openOnActiveDisplay: boolean; pinningMode: boolean; fontSize: number; ollamaApiUrl: string; autoCopySelection: boolean; autoCopyClipboard: boolean; unloadModelIdleMinutes: number; streamingOutput: boolean; }) => {
        try {
            await writeTextFile(await getConfigPath(), JSON.stringify(newSettings, null, 4));
        } catch (error) {
            console.error('Failed to save config file', error);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    // Whenever settings change, update the config file
    useEffect(() => {
        saveSettings(settings);
    }, [settings]);

    const handleSaveClick = async () => {
        console.log('Attempting to save settings'); // Log to confirm the button click
        await saveSettings(settings); // Await the saveSettings call
    };

    const handleInputChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: value
        }));
    };

    return (

        <div className="settings-container bg-gray-800 text-white p-8 rounded-lg overflow-auto">
            <h1 className="settings-title text-3xl mb-6">Settings Window</h1>
            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                <div className="settings-group">
                    <label htmlFor="defaultModel">Default Model:</label>
                    <select
                        id="defaultModel"
                        name="defaultModel"
                        value={settings.defaultModel}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white w-full p-3 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                        {availableModels.map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>

                </div>
                {/* Add other settings inputs here... */}
                <div className="settings-actions">
                    <button
                    type="button"
                    onClick={handleSaveClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                    Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Settings />
    </React.StrictMode>,
);