# AIPlatform-Integration-And-ResponseScraper-BrowserExtension

![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/AIPlatform-Integration-And-ResponseScraper-BrowserExtension/ci.yml?style=flat-square&logo=github)
![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/AIPlatform-Integration-And-ResponseScraper-BrowserExtension?style=flat-square&logo=codecov)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-TS%2C%20Vite%2C%20Tauri-blue?style=flat-square&logo=vite)
![Lint/Format](https://img.shields.io/badge/Lint%2FFormat-Biome-orange?style=flat-square&logo=biome)
![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-orange?style=flat-square&logo=creativecommons)
![GitHub Stars](https://img.shields.io/github/stars/chirag127/AIPlatform-Integration-And-ResponseScraper-BrowserExtension?style=flat-square&logo=github)

[⭐ Star this Repo ⭐](https://github.com/chirag127/AIPlatform-Integration-And-ResponseScraper-BrowserExtension)

## Elevate Your AI Workflow Across Platforms

This browser extension provides seamless integration with major AI platforms like ChatGPT, Claude, and Gemini, enabling embedded experiences and real-time response scraping. Enhance your productivity by centralizing AI interactions and capturing valuable insights directly within your browser.

---

## Table of Contents

*   [Features](#features)
*   [Architecture](#architecture)
*   [AI Agent Directives](#ai-agent-directives)
*   [Development Setup](#development-setup)
*   [Contributing](#contributing)
*   [License](#license)

---

## Features

*   **Unified AI Platform Integration:** Embed and interact with ChatGPT, Claude, Gemini, Perplexity, and more within a consistent interface.
*   **Real-time Response Scraping:** Capture AI-generated responses for analysis, logging, or further processing.
*   **Cross-Platform Compatibility:** Designed for modern browsers.
*   **Extensible Framework:** Built with a modular architecture for easy addition of new AI providers or functionalities.

---

## Architecture

mermaid
graph TD
    A[Browser Extension API] --> B{Content Scripts}
    B --> C[UI/UX Layer (React/Vue/Svelte)]
    B --> D[Background Scripts]
    C --> D
    D --> E[AI Platform Adapters]
    E --> F(AI APIs - OpenAI, Anthropic, Google)
    D --> G[Response Scraper Module]
    G --> H[Data Storage/Messaging]
    F --> D


---

## 🤖 AI Agent Directives

<details>
<summary>View AI Agent Directives</summary>

This repository is engineered under the **Apex Technical Authority** principles, ensuring Zero-Defect, High-Velocity, and Future-Proof development. The following directives guide AI agent interactions and development workflows:

### 1. Technology Stack (Late 2025 Standards)

*   **Language:** TypeScript 6.x (Strict Mode enabled)
*   **Build Tool:** Vite 7 (with Rolldown)
*   **Extension Framework:** Tauri v2.x for native capabilities where applicable, or WXT (Web Extension Tooling) for standard browser extensions.
*   **UI Framework:** [Choose one: React/Vue/Svelte] (Signals for State Management)
*   **Linting & Formatting:** Biome (for maximum speed and comprehensive checks)
*   **Testing:** Vitest (Unit & Integration), Playwright (E2E)

### 2. Architectural Patterns

*   **Core Principles:** SOLID, DRY, KISS, YAGNI.
*   **Modularity:** Employ Feature-Sliced Design (FSD) for clear separation of concerns, especially for AI provider integrations and scraping modules.
*   **State Management:** Utilize Signals for efficient and declarative state updates.
*   **Error Handling:** Implement robust, centralized error handling with clear fallback strategies and informative user feedback.

### 3. Verification & Development Commands

*   **Installation:**
    bash
    # Clone the repository
    git clone https://github.com/chirag127/AIPlatform-Integration-And-ResponseScraper-BrowserExtension.git
    cd AIPlatform-Integration-And-ResponseScraper-BrowserExtension

    # Install dependencies (using Node.js/npm/yarn/pnpm)
    npm install
    # or
    yarn install
    # or
    pnpm install
    
*   **Development Server:**
    bash
    # Start the Vite development server
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    
*   **Build for Production:**
    bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    
*   **Linting & Formatting:**
    bash
    # Run Biome checks
    npm run biome check
    # or
    yarn biome check
    # or
    pnpm biome check

    # Fix Biome issues
    npm run biome format -- --write
    # or
    yarn biome format --write
    # or
    pnpm biome format --write
    
*   **Testing:**
    bash
    # Run Vitest (Unit & Integration)
    npm run test:unit
    # or
    yarn test:unit
    # or
    pnpm test:unit

    # Run Playwright (End-to-End)
    npm run test:e2e
    # or
    yarn test:e2e
    # or
    pnpm test:e2e
    

### 4. Security Mandate

*   **Input Sanitization:** Rigorously sanitize all user inputs and external data to prevent injection attacks.
*   **API Key Management:** Securely manage API keys using environment variables or a dedicated secrets management service. **NEVER** hardcode keys.
*   **Dependency Auditing:** Regularly audit dependencies for known vulnerabilities using `npm audit` or equivalent.

### 5. Operational Excellence

*   **CI/CD:** Leverage GitHub Actions for automated builds, testing, linting, and deployment.
*   **Observability:** Implement comprehensive logging and error reporting for debugging and performance monitoring.

</details>

---

## Development Setup

### Prerequisites

*   Node.js (v20+ recommended)
*   npm, Yarn, or pnpm

### Installation

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/AIPlatform-Integration-And-ResponseScraper-BrowserExtension.git
    cd AIPlatform-Integration-And-ResponseScraper-BrowserExtension
    

2.  **Install dependencies:**
    bash
    npm install
    # Or use yarn: yarn install
    # Or use pnpm: pnpm install
    

### Running the Extension

*   **Development Mode:**
    bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    
    This command starts the Vite development server and prepares the extension for hot-reloading. Follow your browser's instructions for loading unpacked extensions (usually found in `chrome://extensions` or `edge://extensions`).

*   **Build for Production:**
    bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    
    This creates an optimized production build in the `dist` directory.

### Scripts

| Script            | Description                                             |
| :---------------- | :------------------------------------------------------ |
| `dev`             | Starts the development server with hot-reloading.       |
| `build`           | Builds the extension for production.                    |
| `preview`         | Locally preview production build.                       |
| `test:unit`       | Runs unit and integration tests with Vitest.            |
| `test:e2e`        | Runs end-to-end tests with Playwright.                  |
| `lint`            | Runs Biome linter to check code style and quality.      |
| `lint:fix`        | Runs Biome linter and attempts to fix issues.           |
| `format`          | Runs Biome formatter to format code.                    |
| `format:write`    | Runs Biome formatter and writes formatted code.         |

---

## Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING.md](https://github.com/chirag127/AIPlatform-Integration-And-ResponseScraper-BrowserExtension/blob/main/.github/CONTRIBUTING.md) file for detailed guidelines on how to submit issues, feature requests, and pull requests.

---

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). See the [LICENSE](https://github.com/chirag127/AIPlatform-Integration-And-ResponseScraper-BrowserExtension/blob/main/LICENSE) file for more details.
