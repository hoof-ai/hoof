import React, {useEffect} from 'react';
import TopBar from './components/TopBar';
import PromptTextArea from './components/PromptTextArea';
import useEscape from "./hooks/useEscape.tsx";
import {invoke} from "@tauri-apps/api/tauri";
import ResponseArea from "./components/ResponseArea.tsx";

const App: React.FC = () => {

    useEscape();
    useEffect(() => {
        invoke("init_spotlight_window");
    }, []);

    return (
        <div className="app bg-gray-900 text-white h-screen overflow-hidden flex flex-col">
            <TopBar/>
            <div className="flex flex-grow flex-col">
                <PromptTextArea/>
                <ResponseArea/>
            </div>
        </div>
    );
};

export default App;
