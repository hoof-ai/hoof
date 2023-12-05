import React from 'react';
import Navigation from "./Navigation.tsx";
import OllamaSettings from "./OllamaSettings.tsx";

const SettingsLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-800">
            <Navigation />
            <OllamaSettings />
        </div>
    );
};

export default SettingsLayout;
