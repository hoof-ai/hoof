import React from "react";

interface SettingsGroupProps {
    title: string;
    subItems: string[];
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({ title, subItems }) => {
    return (
        <div>
            <div className="text-gray-300 font-bold text-lg">{title}</div>
            {subItems.map(subItem => (
                <div key={subItem} className="text-lg text-gray-400">{subItem}</div>
            ))}
        </div>
    );
};

export default SettingsGroup;