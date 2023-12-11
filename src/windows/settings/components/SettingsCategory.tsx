import React from "react";

interface SettingsCategoryProps {
    title: string;
    children: React.ReactNode;
}

interface SettingSectionProps {
    title: string;
}

export const SettingsCategory: React.FC<SettingsCategoryProps> = ({ title, children }) => {
    return (
    <div className="mb-2">
        <div className="text-gray-300 font-bold text-xl">{title}</div>
        {children}
    </div>
)
    ;
};

export const SettingsSection: React.FC<SettingSectionProps> = ({ title }) => {
    const handleClick = () => {
        console.log(title);
    }
    return (
        <div className="text-gray-300 font-medium text-lg">
            <a className="underline cursor-pointer" onClick={handleClick}>{title}</a>
        </div>
    );
};