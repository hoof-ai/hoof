import React, {KeyboardEvent} from 'react';
import {useQuery} from "../hooks/useQuery.ts";
import clsx from 'clsx';

interface PromptTextAreaProps {
}

const PromptTextArea: React.FC<PromptTextAreaProps> = ({}: PromptTextAreaProps) => {
    const { askOllama, setCurrentQuestion, currentQuestion, queryState } = useQuery();


    const handleKeyPress = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // To prevent form submission.
            await askOllama();
        }
    };

    const classNames = clsx('relative', {
        'flex-grow': queryState === 'preQuery' // only force the height if we're entering a prompt.
    });

    return (
        <div className={classNames}>
            <textarea
                className="flex-grow bg-gray-800 text-white p-4 w-full h-full resize-none overflow-y-auto"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your prompt"
            />
            <div
                className="absolute bottom-2 right-3 text-white text-xs opacity-50"> {/* Absolute positioning for the overlay text */}
                Hit return to ask your question
            </div>
        </div>
    );
};

export default PromptTextArea;
