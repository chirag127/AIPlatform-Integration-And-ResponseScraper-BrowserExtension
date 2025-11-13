# AGENTS.md

## Commands

**Setup:** `npm install`

**Build:** `npm run build`

**Lint:** `npm run lint`

**Test:** `npm run test`

**Dev Server:** N/A (Use examples/usage.html with a local server)

## Tech Stack

- TypeScript
- ES Modules
- DOM APIs for iframe manipulation
- postMessage API for cross-origin communication

## Architecture & Structure

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

## Code Style

- TypeScript with strict mode enabled
- ES2020 target
- Abstract classes for shared functionality
- Type-safe interfaces for configuration
- ESLint for code quality
