# Building

When building a lot fast especially in a new language I need a reference sheet breaking down the steps of what I am doing.

## First Steps

Not sure the best place to start so I will start with what I know best, frontend. I will get a chat up and running so we have something to type questions and responses in. Then move to connecting it to the Ollama instance that is running. Then come back and create a way to change the models based on those that are installed. Then implement the hot key system to open the chat, then just dump a "starting" screen/state that is just the hotkey bar then change state to something like "chat" which changes the UI to the full chat interface.

1. **Frontend Development**:
   - Start with setting up a basic chat interface.
   - Connect the frontend to the local Ollama instance.
   - Create a model selector to switch between different Ollama models.
   - Implement the hotkey functionality to open the chat interface.
   - Design a "starting" screen that activates with the hotkey and transitions to the "chat" state.

## Detailed Steps

### Frontend

- [ ] Set up the initial project structure using Tauri.
- [ ] Design a simple chat UI with HTML/CSS. [Tauri Docs](https://tauri.app/v1/guides/getting-started/setup/html-css-js/)
- [ ] Implement the chat functionality with JavaScript to handle user input and display responses.

### Backend

- [ ] Write a Rust server to handle incoming requests and communicate with the Ollama service.
- [ ] Implement an endpoint to list available Ollama models using the `ollama list` command.
- [ ] Create an endpoint to send prompts to the Ollama model and receive responses.

### Integration

- [ ] Connect the frontend chat interface to the Rust backend server.
- [ ] Ensure the model selector on the frontend fetches the list of models from the backend.
- [ ] Handle the selection of models and sending of prompts through the UI.

### Hotkey Functionality

- [ ] Research and integrate a Rust library for global hotkey registration.
- [ ] Set up the hotkey to trigger the chat interface.
- [ ] Implement state management to switch between the "starting" screen and the "chat" interface.
