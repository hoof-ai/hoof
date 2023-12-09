import React from 'react';
import SettingsList from "./SettingsList.tsx";
import SettingsPanel from "./SettingsPanel.tsx";

const SettingsLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-700">
            <SettingsList />
            <SettingsPanel />
        </div>
    );
};

export default SettingsLayout;
