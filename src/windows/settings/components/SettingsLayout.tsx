import React from 'react';

interface NavItemProps {
    title: string;
    subItems: string[];
}

interface SettingInputProps {
    label: string;
    defaultValue: string;
}

interface SettingToggleProps {
    label: string;
}

const SettingsLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-800">
            <Navigation />
            <OllamaSettings />
        </div>
    );
};

const Navigation: React.FC = () => {
    return (
        <div className="w-1/4 bg-gray-700 p-5">
            <NavItem title="Models" subItems={["Ollama Settings", "Model Output", "Model Input"]} />
            <NavItem title="Spotlight" subItems={["Keyboard Shortcuts", "Clipboard usage", "Monitor usage"]} />
            <NavItem title="Chat" subItems={["Conversation History", "User Interface", "Permissions"]} />
        </div>
    );
};

const NavItem: React.FC<NavItemProps> = ({ title, subItems }) => {
    return (
        <div className="mb-4">
            <div className="text-gray-300 font-bold">{title}</div>
            {subItems.map(subItem => (
                <div key={subItem} className="text-gray-400 ml-2">{subItem}</div>
            ))}
        </div>
    );
};

const OllamaSettings: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col p-5">
            <SearchBar />
            <div className="flex-1 bg-gray-700 p-4 rounded-lg mt-5 flex flex-col justify-between">
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

const SearchBar: React.FC = () => {
    return (
        <div className="bg-gray-700 p-3 rounded-lg">
            <input
                type="text"
                placeholder="Search settings"
                className="w-full bg-gray-600 text-white p-2 rounded"
            />
        </div>
    );
};

const SettingInput: React.FC<SettingInputProps> = ({ label, defaultValue }) => {
    return (
        <div className="flex items-center mb-3">
            <label className="text-gray-300 w-1/3">{label}</label>
            <input type="text" defaultValue={defaultValue} className="w-2/3 bg-gray-600 text-white p-2 rounded" />
        </div>
    );
};

const SettingToggle: React.FC<SettingToggleProps> = ({ label }) => {
    return (
        <div className="flex items-center mb-3">
            <label className="text-gray-300 w-1/3">{label}</label>
            <div className="w-2/3">
                <input type="checkbox" className="toggle toggle-accent" />
            </div>
        </div>
    );
};

export default SettingsLayout;
