import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import "../../styles.css";
import SettingsLayout from "./components/SettingsLayout.tsx";

const Settings = () => {
    async function setupAppWindow() {
        const appWindow = (await import('@tauri-apps/api/window')).appWindow
        await appWindow.show();
    }

    useEffect(() => {
        setupAppWindow()
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