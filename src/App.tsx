import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

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

  async function askOllama() {
    const response = await invoke<string>('askollama', {
      question,
      models: selectedModel,
    });
    setOllamaResponse(response);
  }

  return (
<div className="min-w-screen bg-gray-800 min-h-screen flex pt-4 flex-col justify-center items-center overflow-x-hidden">
      <img src="/rllama.png" alt="Ollama" className="w-24 mb-4 rounded-full" />
      <h1 className="text-5xl text-center text-gray-300 font-bold mb-6">Welcome to Rusty Llama</h1>

      <div className="mb-4 text-gray-300 text-lg">
        <span className="font-semibold">Current configuration:</span> {selectedModel}
      </div>

      <div className="flex font-mono flex-col items-center w-full max-w-md mb-4">
        <input
          id="question-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask Ollama a question..."
          className="px-4 py-2 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          onClick={askOllama}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Ask
        </button>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-4 w-full max-w-2xl mb-4">
        <p className="font-mono text-gray-700 whitespace-pre-wrap">{ollamaResponse || 'Your answer will appear here...'}</p>
      </div>

      <div className="flex flex-col items-center w-full max-w-md">
        <label htmlFor="model-select" className="text-gray-500 mb-2 font-semibold">Choose a model:</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="px-4 py-2 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
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
