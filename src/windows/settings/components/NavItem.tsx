import React from "react";

interface NavItemProps {
    title: string;
    subItems: string[];
}

const NavItem: React.FC<NavItemProps> = ({ title, subItems }) => {
    return (
        <div>
            <div className="text-gray-300 font-bold text-lg">{title}</div>
            {subItems.map(subItem => (
                <div key={subItem} className="text-lg text-gray-400">{subItem}</div>
            ))}
        </div>
    );
};

export default NavItem;