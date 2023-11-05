import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { getClient, Body, ResponseType } from '@tauri-apps/api/http';
import './App.css';

interface OllamaResponse {
  response: string;
  done: boolean;
}

function App() {
  const [greetMsg, setGreetMsg] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [ollamaResponse, setOllamaResponse] = useState<string>('');
  const [ollamaQuestion, setOllamaQuestion] = useState<string>('');

  async function greet() {
    console.log('Greet function called with name:', name);
    const response = await invoke<string>('greet', { name });
    console.log('Greet response:', response);
    setGreetMsg(response);
  }

  async function askOllama(question: string) {
    console.log('askOllama called with question:', question);
    setOllamaResponse('');
    try {
      const client = getClient(); // getClient does not return a Promise
      console.log('HTTP client obtained:', client);
      const body = Body.json({
        model: 'mistral:latest',
        prompt: question,
      });

      console.log('Request body:', body);
      const response = await client.post<OllamaResponse>('http://localhost:11434/api/generate', body, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: ResponseType.Json, // Correct capitalization
      });

      console.log('Response:', response);
      if (response.ok && response.data) {
        console.log('Response data:', response.data);
        setOllamaResponse(response.data.response);
      } else {
        console.error('Request failed:', response);
      }
    } catch (error) {
      console.error('Error asking Ollama:', error);
    }
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
          console.log('Ollama form submitted with question:', ollamaQuestion); // Log when ollama form is submitted
          askOllama(ollamaQuestion);
        }}
      >
        <input
          id="ollama-input"
          type="text"
          value={ollamaQuestion}
          onChange={(e) => {
            console.log('Ollama question input changed:', e.currentTarget.value); // Log changes to the ollama question input
            setOllamaQuestion(e.currentTarget.value);
          }}
          placeholder="Ask Ollama a question..."
        />
        <button type="submit">Ask Ollama</button>
      </form>

      <p>{ollamaResponse}</p>
    </div>
  );
}

export default App;
