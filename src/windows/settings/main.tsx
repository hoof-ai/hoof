import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import "../../styles.css";
import SettingsLayout from "./components/SettingsLayout.tsx";
import { invoke } from '@tauri-apps/api/tauri';

type SettingValue = string | number | boolean; // Matches SettingValue enum in Rust

interface SettingsSection {
    [key: string]: SettingValue;
}

const Settings = () => {
    async function setupAppWindow() {
        const appWindow = (await import('@tauri-apps/api/window')).appWindow
        await appWindow.show();
    }

    async function writeSetting(category: string, section: string, value: SettingsSection) {
        try {
            await invoke('write_setting', { category, section, value });
            console.log('Setting updated successfully');
        } catch (error) {
            console.error('Error writing setting:', error);
        }
    }

    async function readSetting(category: string, section: string) {
        try {
            const settingValue = await invoke('read_setting', { category, section });
            console.log('Setting Value:', settingValue);
        } catch (error) {
            console.error('Error reading setting:', error);
        }
    }
    useEffect(() => {
        setupAppWindow()
        writeSetting('General', 'User', { Name: "Alice", Email: "alice@example.com" })
            .then(() => console.log('Setting updated successfully'))
            .then(() => readSetting('General', 'User'))
            .then(() => console.log('Setting read successfully'))
            .catch((error) => console.error('Error:', error));
    }, [])

    return (
        <SettingsLayout/>
    )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Settings/>
    </React.StrictMode>,
);