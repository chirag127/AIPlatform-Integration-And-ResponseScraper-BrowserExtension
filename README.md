# AI Platform Integrations and Response Scraper

A comprehensive suite of AI platform integration tools including iframe embedding modules and a real-time response scraper with multi-platform support.

## AI Platform Integrations

Integration modules for embedding major AI platforms using iframe embedding with query parameter injection and postMessage communication.

### Supported Platforms

- **ChatGPT** - OpenAI's ChatGPT with query parameter support
- **Claude** - Anthropic's Claude with postMessage communication
- **Gemini** - Google's Gemini with query parameter support
- **Perplexity** - Perplexity AI with query parameter support
- **Grok** - X's Grok with postMessage communication
- **Copilot** - Microsoft Copilot with query parameter support
- **Meta AI** - Meta AI with query parameter support

### Usage

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

### API

#### BaseAIIntegration

Base class for all AI integrations.

##### Methods

- `createIframe(container: HTMLElement, prompt?: string): HTMLIFrameElement` - Creates and embeds an iframe
- `updatePrompt(prompt: string): void` - Updates the prompt (via query params or postMessage)
- `sendMessage(message: MessagePayload): void` - Sends a postMessage to the iframe
- `onMessage(type: string, handler: (data: any) => void): void` - Registers a message handler
- `destroy(): void` - Removes the iframe and cleans up resources

##### Configuration

Each integration has the following configuration:

- `name`: Display name of the platform
- `baseUrl`: Base URL of the platform
- `supportsQueryParams`: Whether the platform supports query parameter injection
- `supportsPostMessage`: Whether the platform supports postMessage communication
- `queryParamKey`: The query parameter key for prompt injection (if supported)

### Features

- **iframe Embedding**: Safely embed AI platforms in your application
- **Query Parameter Injection**: Pass prompts via URL parameters where supported
- **postMessage Communication**: Two-way communication with platforms that support it
- **Type-safe**: Written in TypeScript with full type definitions
- **Extensible**: Easy to add new platform integrations

## AI Response Scraper

A multi-platform AI response scraper and display system with MutationObserver-based content extraction, per-platform parsers, loading states, error handling, and tabbed/accordion UI.

### Features

- **MutationObserver-based Content Extraction**: Real-time monitoring and extraction of AI responses
- **Multi-Platform Support**: 
  - ChatGPT (chat.openai.com, chatgpt.com)
  - Claude (claude.ai)
  - Gemini (gemini.google.com)
  - Perplexity (perplexity.ai)
- **Per-Platform Parsers**: Specialized parsers for each AI platform
- **Loading States**: Visual feedback during scraping operations
- **Error Handling**: Robust error handling with user-friendly messages
- **Dual View Modes**:
  - Tab View: Browse responses in separate tabs
  - Accordion View: Collapsible list view
- **Response Management**: Copy responses, view source, clear all

### Architecture

#### Core Components

- **ResponseStore**: Event-driven state management for responses
- **ScraperManager**: Coordinates multiple platform parsers and observers
- **ContentObserver**: MutationObserver wrapper for DOM monitoring
- **UIManager**: Handles all UI rendering and interactions

#### Parsers

Each platform has a dedicated parser extending `BaseParser`:
- `ChatGPTParser`: Extracts responses from ChatGPT
- `ClaudeParser`: Extracts responses from Claude
- `GeminiParser`: Extracts responses from Gemini
- `PerplexityParser`: Extracts responses from Perplexity

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Response Scraper Usage

1. Open the application in your browser
2. Click "Start Scraping" to begin monitoring for AI responses
3. Navigate to a supported AI platform and interact with it
4. View captured responses in either Tab or Accordion view
5. Click "Copy" to copy a response to clipboard
6. Click "View Source" to open the original conversation
7. Click "Clear All" to remove all captured responses
8. Click "Stop Scraping" when done

### How It Works

1. **Detection**: When scraping starts, the ScraperManager checks which platform parser matches the current URL
2. **Monitoring**: ContentObserver sets up a MutationObserver on the platform's target node
3. **Extraction**: When new content is detected, the appropriate parser extracts the response
4. **Storage**: Valid responses are stored in ResponseStore with metadata
5. **Display**: UIManager renders responses in the selected view mode

## License

MIT
