import React, {useEffect} from 'react';
import TopBar from './components/TopBar';
import PromptTextArea from './components/PromptTextArea';
import useEscape from "./hooks/useEscape.tsx";
import {invoke} from "@tauri-apps/api/tauri";
import {useQuery} from "./hooks/useQuery.ts";

const App: React.FC = () => {

    useEscape();
    useEffect(() => {
        invoke("init_spotlight_window");
    }, []);

    const { currentResponse, queryState } = useQuery();

    return (
        <div className="app bg-gray-900 text-white h-screen overflow-hidden flex flex-col">
            <TopBar/>
            <div className="flex flex-grow flex-col">
                <PromptTextArea/>
                {
                    queryState === 'asking' && (
                        <div className="flex-grow flex items-center justify-center">
                            <div className="text-3xl">Loading...</div>
                        </div>
                    )
                }
                {
                    queryState === 'error' && (
                        <div className="flex-grow flex items-center justify-center">
                            <div className="text-3xl">Error</div>
                        </div>
                    )
                }
                {
                    queryState === 'idle' && currentResponse && (
                        <div className="flex-grow min-h-[100px]">{currentResponse}</div>
                    )
                }

            </div>
        </div>
    );
};

export default App;
