import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';
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
    <div className="container">
      <h1>Welcome to the Ollama UI</h1>

      <p>The current configuration is {selectedModel}</p>


      <div className="row">
        <input
          id="question-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.currentTarget.value)}
          placeholder="Ask Ollama a question..."
        />
        <button onClick={askOllama}>Ask</button>
      </div>

      <p>{ollamaResponse}</p>

      <div className="row">
        <label htmlFor="model-select">Choose a model:</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.currentTarget.value)}
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
