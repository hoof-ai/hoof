import React from 'react';
import ModelSelect from './ModelSelect.tsx';
import { AdjustmentsVerticalIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import {invoke} from "@tauri-apps/api/tauri";

interface TopBarProps {
}

const TopBar: React.FC<TopBarProps> = () => {
    const handleChatModeClicked = async () => {
        await invoke<void>('open_chat_window');
    }

    const handleSettingsClicked = async () => {
        await invoke<void>('open_settings_window');
    }
    return (
        <div className="flex justify-between items-center">
            <img src="/logo.png" alt="Logo" className="h-9 w-9 rounded-full" />
            <div className="flex-grow">
                <div className="flex justify-center">
                    <ModelSelect />
                </div>
            </div>
            <div>
                <button
                    onClick={handleSettingsClicked}
                    className="inline-flex justify-center items-center p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                    <AdjustmentsVerticalIcon className="h-5 w-5 text-white" />
                </button>
                <button
                    onClick={handleChatModeClicked}
                    className="inline-flex justify-center items-center p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ml-2"
                >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
