# AI Platform Integrations

A collection of integration modules for embedding major AI platforms using iframe embedding with query parameter injection and postMessage communication.

## Supported Platforms

- **ChatGPT** - OpenAI's ChatGPT with query parameter support
- **Claude** - Anthropic's Claude with postMessage communication
- **Gemini** - Google's Gemini with query parameter support
- **Perplexity** - Perplexity AI with query parameter support
- **Grok** - X's Grok with postMessage communication
- **Copilot** - Microsoft Copilot with query parameter support
- **Meta AI** - Meta AI with query parameter support

## Usage

```typescript
import { ChatGPTIntegration, ClaudeIntegration, AIIntegrations } from './src/integrations';

const container = document.getElementById('ai-container');
const chatgpt = new ChatGPTIntegration();
chatgpt.createIframe(container, 'Hello, how are you?');

chatgpt.onMessage('response', (data) => {
  console.log('Received response:', data);
});

chatgpt.updatePrompt('Tell me a joke');

chatgpt.destroy();
```

## API

### BaseAIIntegration

Base class for all AI integrations.

#### Methods

- `createIframe(container: HTMLElement, prompt?: string): HTMLIFrameElement` - Creates and embeds an iframe
- `updatePrompt(prompt: string): void` - Updates the prompt (via query params or postMessage)
- `sendMessage(message: MessagePayload): void` - Sends a postMessage to the iframe
- `onMessage(type: string, handler: (data: any) => void): void` - Registers a message handler
- `destroy(): void` - Removes the iframe and cleans up resources

### Configuration

Each integration has the following configuration:

- `name`: Display name of the platform
- `baseUrl`: Base URL of the platform
- `supportsQueryParams`: Whether the platform supports query parameter injection
- `supportsPostMessage`: Whether the platform supports postMessage communication
- `queryParamKey`: The query parameter key for prompt injection (if supported)

## Features

- **iframe Embedding**: Safely embed AI platforms in your application
- **Query Parameter Injection**: Pass prompts via URL parameters where supported
- **postMessage Communication**: Two-way communication with platforms that support it
- **Type-safe**: Written in TypeScript with full type definitions
- **Extensible**: Easy to add new platform integrations
