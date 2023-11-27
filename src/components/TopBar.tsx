import React from 'react';
import ModelSelect from './ModelSelect';
import { AdjustmentsVerticalIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface TopBarProps {
}

const TopBar: React.FC<TopBarProps> = () => {
    return (
        <div className="flex justify-between items-center">
            <img src="/rllama.png" alt="Logo" className="h-9 w-9 rounded-full" />
            <div className="flex-grow">
                <div className="flex justify-center">
                    <ModelSelect />
                </div>
            </div>
            <div>
                <button
                    onClick={() => alert('Settings placeholder')}
                    className="inline-flex justify-center items-center p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                    <AdjustmentsVerticalIcon className="h-5 w-5 text-white" />
                </button>
                <button
                    onClick={() => alert('Chat mode placeholder')}
                    className="inline-flex justify-center items-center p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ml-2"
                >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
