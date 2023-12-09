import React from "react";
import SettingsGroup from "./SettingsGroup.tsx";
import SettingsSearchBox from "./SettingsSearchBox.tsx";

const SettingsList: React.FC = () => {
    return (
        <div className="flex flex-col bg-gray-800 p-4 gap-4">
            <SettingsSearchBox/>
            <SettingsGroup title="Models" subItems={["Ollama Settings", "Model Output", "Model Input"]} />
            <SettingsGroup title="Spotlight" subItems={["Keyboard Shortcuts", "Clipboard usage", "Monitor usage"]} />
            <SettingsGroup title="Chat" subItems={["Conversation History", "User Interface", "Permissions"]} />
        </div>
    );
};

export default SettingsList;