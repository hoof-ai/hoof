import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import useEscape from "./hooks/useEscape.tsx";

interface ModelList {
  models: string[];
}

function App() {
  const [ollamaResponse, setOllamaResponse] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    // Fetch the models when the component mounts
    async function fetchModels() {
      try {
        const modelsList = await invoke<ModelList>('get_ollama_models');
        setModels(modelsList.models);
        setSelectedModel(modelsList.models[0]); // Set the first model as selected by default
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    }

    fetchModels();
  }, []);

  useEscape();
  useEffect(() => {
    invoke("init_spotlight_window");
  }, []);


  async function askOllama() {
    const response = await invoke<string>('askollama', {
      question,
      models: selectedModel,
    });
    setOllamaResponse(response);
  }

  return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-4 overflow-x-hidden bg-gray-800 min-w-screen">
        <img src="/rllama.png" alt="Ollama" className="w-24 mb-4 rounded-full" />
        <h1 className="mb-6 text-5xl font-bold text-center text-gray-300">Welcome to Rusty Llama</h1>

        <div className="mb-4 text-lg text-gray-300">
          <span className="font-semibold">Current configuration:</span> {selectedModel}
        </div>

        <div className="flex flex-col items-center w-full max-w-md mb-4 font-mono">
          <input
              id="question-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Ollama a question..."
              className="w-full px-4 py-2 transition-colors border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
              onClick={askOllama}
              className="px-6 py-2 mt-4 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Ask
          </button>
        </div>

        <div className="w-full max-w-2xl p-4 mb-4 bg-white rounded-lg shadow-xl">
          <p className="font-mono text-gray-700 whitespace-pre-wrap">{ollamaResponse || 'Your answer will appear here...'}</p>
        </div>

        <div className="flex flex-col items-center w-full max-w-md">
          <label htmlFor="model-select" className="mb-2 font-semibold text-gray-500">Choose a model:</label>
          <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-2 transition-colors border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
            ))}
          </select>
        </div>
      </div>
  );
}

export default App;
