import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';

interface ModelList {
  models: string[];
}

function App() {
  const [greetMsg, setGreetMsg] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [ollamaResponse, setOllamaResponse] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    // Fetch the models when the component mounts
    getOllamaModels();
  }, []);

  async function getOllamaModels() {
    try {
      const modelList: ModelList = await invoke('get_ollama_models');
      setModels(modelList.models);
      // Optionally set the first model as the selected one
      if (modelList.models.length > 0) {
        setSelectedModel(modelList.models[0]);
      }
    } catch (error) {
      console.error('Failed to get models:', error);
    }
  }

  async function greet() {
    const response: string = await invoke('greet', { name });
    setGreetMsg(response);
  }

  async function askOllama() {
    const response: string = await invoke('askollama', { question });
    setOllamaResponse(response);
  }

  return (
    <div className="container">
      <h1>Welcome to the Ollama UI</h1>

      <p>The current configuration is {selectedModel}</p>

      <div className="row">
        <input
          id="greet-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button onClick={greet}>Greet</button>
      </div>

      <p>{greetMsg}</p>

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
