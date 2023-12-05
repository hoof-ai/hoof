import React from "react";
import NavItem from "./NavItem.tsx";
import SearchBar from "./SearchBar.tsx";

const Navigation: React.FC = () => {
    return (
        <div className="flex flex-col bg-gray-700 p-4 gap-4">
            <SearchBar/>
            <NavItem title="Models" subItems={["Ollama Settings", "Model Output", "Model Input"]} />
            <NavItem title="Spotlight" subItems={["Keyboard Shortcuts", "Clipboard usage", "Monitor usage"]} />
            <NavItem title="Chat" subItems={["Conversation History", "User Interface", "Permissions"]} />
        </div>
    );
};

export default Navigation;