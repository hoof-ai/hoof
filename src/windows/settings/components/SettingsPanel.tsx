import React from "react";
import {SettingInput, SettingToggle} from "./SettingsFields.tsx";

const SettingsPanel: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <SettingInput label="Ollama URL" defaultValue="http://localhost:12353" />
                    <SettingToggle label="Streaming Output" />
                </div>
                <div className="flex justify-end mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">SAVE</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded">CANCEL</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;