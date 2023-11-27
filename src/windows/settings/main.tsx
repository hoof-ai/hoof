import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import "../../styles.css";

const Settings = () => {
    async function setupAppWindow() {
        const appWindow = (await import('@tauri-apps/api/window')).appWindow
        await appWindow.show();
    }

    useEffect(() => {
        setupAppWindow()
    }, [])

    return (
        <div>
            <h1>Settings Window</h1>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Settings/>
    </React.StrictMode>,
);