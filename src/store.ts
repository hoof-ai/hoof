import { create } from 'zustand';
import {invoke} from "@tauri-apps/api/tauri";

export interface State {
    availableModels: string[];
    setAvailableModels: (models: string[]) => void;
    selectedModel: string;
    selectModel: (model: string) => void;

    currentQuestion: string;
    setCurrentQuestion: (currentQuestion: string) => void;
    currentResponse: string;
    queryState: 'preQuery' | 'asking' | 'error' | 'postQuery';
    askOllama: () => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
    availableModels: [],
    setAvailableModels: (models) => set({ availableModels: models }),

    selectedModel: '',
    selectModel: (model) => set({ selectedModel: model }),

    currentQuestion: '',
    setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
    currentResponse: '',
    queryState: 'preQuery',
    askOllama: async () => {
        try {
            const question = get().currentQuestion;
            try {
                set({queryState: 'asking'});
                const response = await invoke<string>('askollama', {
                    question,
                    models: get().selectedModel,
                });
                set({currentResponse: response});
                set({queryState: 'postQuery'});
            } catch (e) {
                console.error('Failed to ask Ollama:', e);
                set({queryState: 'error'});
            }
        } catch (error) {
            console.error('Failed to ask Ollama:', error);
        }
    }
}));