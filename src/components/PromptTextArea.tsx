import React, {KeyboardEvent} from 'react';
import {useQuery} from "../hooks/useQuery.ts";

interface PromptTextAreaProps {
}

const PromptTextArea: React.FC<PromptTextAreaProps> = ({}: PromptTextAreaProps) => {
    const { askOllama, setCurrentQuestion, currentQuestion } = useQuery();

    const handleKeyPress = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // To prevent form submission.
            await askOllama();
        }
    };

    return (
        <div className="relative flex flex-col p-5 h-full"> {/* Padding and full height */}
            <textarea
                className="flex-grow bg-gray-800 text-white p-4 resize-none overflow-y-auto"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your prompt"
            />
            <div
                className="absolute bottom-6 right-7 text-white text-xs opacity-50"> {/* Absolute positioning for the overlay text */}
                Hit return to ask your question
            </div>
        </div>
    );
};

export default PromptTextArea;
