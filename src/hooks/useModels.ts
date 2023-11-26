import {useEffect} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import { useShallow } from 'zustand/react/shallow'
import {State, useStore} from "../store.ts";

interface ModelList {
    models: string[];
}

export function useModels() {
    const { setAvailableModels, availableModels, selectModel, selectedModel } = useStore(
        useShallow((state: State) => ({
            setAvailableModels: state.setAvailableModels,
            availableModels: state.availableModels,
            selectModel: state.selectModel,
            selectedModel: state.selectedModel,
        })),
    )
    useEffect(() => {
        // Fetch the models when the component mounts
        async function fetchModels() {
            try {
                const modelsList = await invoke<ModelList>('get_ollama_models');
                setAvailableModels(modelsList.models);
                selectModel(modelsList.models[0]); // Set the first model as selected by default
            } catch (error) {
                console.error('Failed to fetch models:', error);
            }
        }

        fetchModels();
    }, [setAvailableModels, selectModel]);
    return {
        availableModels,
        selectedModel,
        selectModel,
    }
}

