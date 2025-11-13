# AGENTS.md

## Commands

**Setup:** `npm install`

**Build:** `npm run build`

**Lint:** `npm run lint`

**Test:** `npm run test`

**Dev Server (Vite):** `npm run dev`

## Tech Stack

- TypeScript
- ES Modules
- DOM APIs for iframe manipulation
- postMessage API for cross-origin communication
- Vite 5.x (build tool for modern web apps)
- JavaScript (ES Modules) with Vitest for testing

## Architecture & Structure

### AI Platform Integrations

```
src/
  integrations/
    base-integration.ts    # Abstract base class for all integrations
    chatgpt.ts            # ChatGPT integration
    claude.ts             # Claude integration
    gemini.ts             # Gemini integration
    perplexity.ts         # Perplexity integration
    grok.ts               # Grok integration
    copilot.ts            # Copilot integration
    meta-ai.ts            # Meta AI integration
    index.ts              # Barrel exports
examples/
  usage.html              # Demo HTML page
```

Each integration extends `BaseAIIntegration` and configures:
- Base URL
- Query parameter support and key
- postMessage support
- Valid origins for postMessage security

### Response Scraper

#### Core Components
- **ResponseStore** (`src/store/ResponseStore.js`): Event-driven store for managing AI responses
- **ScraperManager** (`src/scraper/ScraperManager.js`): Coordinates platform parsers and observers
- **ContentObserver** (`src/scraper/ContentObserver.js`): MutationObserver wrapper for DOM changes
- **UIManager** (`src/ui/UIManager.js`): Handles all UI rendering and user interactions

#### Platform Parsers
Each parser extends `BaseParser` (`src/scraper/parsers/BaseParser.js`):
- **ChatGPTParser**: Matches `chat.openai.com` and `chatgpt.com`
- **ClaudeParser**: Matches `claude.ai`
- **GeminiParser**: Matches `gemini.google.com`
- **PerplexityParser**: Matches `perplexity.ai`

#### Design Patterns
- **Observer Pattern**: Used for MutationObserver and event-driven updates
- **Strategy Pattern**: Platform-specific parsers implement common interface
- **Singleton Pattern**: Single store instance manages all responses

## Code Style

- TypeScript with strict mode enabled
- ES2020 target
- Abstract classes for shared functionality
- Type-safe interfaces for configuration
- ESLint for code quality
- ES6+ modules with named exports
- Async/await for asynchronous operations
- Event-driven architecture with custom event emitters
- No JSX/frameworks - vanilla JavaScript DOM manipulation
- Class-based components with clear separation of concerns
