import React from "react";

interface SettingInputProps {
    label: string;
    defaultValue: string;
}

interface SettingToggleProps {
    label: string;
    checked?: boolean;
}

export const SettingInput: React.FC<SettingInputProps> = ({ label, defaultValue }) => {
    return (
        <div className="flex items-center mb-3">
            <label className="text-gray-300 w-1/3">{label}</label>
            <input type="text" defaultValue={defaultValue} className="w-2/3 bg-gray-600 text-white p-2 rounded" />
        </div>
    );
};

export const SettingToggle: React.FC<SettingToggleProps> = ({ label, checked }) => {
    return (
        <div className="flex items-center mb-3">
            <label className="text-gray-300 w-1/3">{label}</label>
            <div className="w-2/3">
                <input type="checkbox" className="toggle toggle-accent" checked={checked} />
            </div>
        </div>
    );
};