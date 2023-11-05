import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';


function App() {
  const [greetMsg, setGreetMsg] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [ollamaResponse, setOllamaResponse] = useState<string>('');
  const [question, setOllamaQuestion] = useState<string>('');

  async function greet() {
    console.log('Greet function called with name:', name);
    const response = await invoke<string>('greet', { name });
    console.log('Greet response:', response);
    setGreetMsg(response);
  }

  async function askollama() {
    console.log('askOllama called with question:', question);
    const response = await invoke<string>('askollama', { question });
    console.log('Ollama response:', response);
    setOllamaResponse(response);
  }

  return (
    <div className="container">
      <h1>Welcome to the Ollama UI</h1>

      <p>The current configuration is mistral:latest</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Greet form submitted with name:', name); // Log when greet form is submitted
          greet();
        }}
      >
        <input
          id="greet-input"
          type="text"
          onChange={(e) => {
            console.log('Name input changed:', e.currentTarget.value); // Log changes to the name input
            setName(e.currentTarget.value);
          }}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Ollama form submitted with question:', question); // Log when ollama form is submitted
          askollama();
        }}
      >
        <input
          id="greet-input"
          type="text"
          onChange={(e) => {
            console.log('Ollama question input changed:', e.currentTarget.value); // Log changes to the ollama question input
            setOllamaQuestion(e.currentTarget.value);
          }}
          placeholder="Ask Ollama a question..."
        />
        <button type="submit">Ask</button>
      </form>

      <p>{ollamaResponse}</p>
    </div>
  );
}

export default App;
