import {State, useStore} from "../store.ts";
import {useShallow} from "zustand/react/shallow";

export function useQuery() {
    return useStore(
        useShallow((state: State) => ({
            setCurrentQuestion: state.setCurrentQuestion,
            currentQuestion: state.currentQuestion,
            askOllama: state.askOllama,
            currentResponse: state.currentResponse,
            queryState: state.queryState,
        })),
    )
}