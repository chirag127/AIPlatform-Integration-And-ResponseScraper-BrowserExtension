# Feature Request

**User:** @{{user}}
**Date:** {{date}}

## 🚀 Feature Idea

*(Please provide a clear and concise description of the feature you would like to see.)*

---

## 🤔 Why This Feature?

*(Explain why this feature would be valuable. What problem does it solve? How would it improve the integration with AI platforms or data extraction capabilities?)*

---

## 💡 Proposed Implementation (Optional)

*(If you have any ideas on how this feature could be implemented, feel free to share them here. This could include specific API calls, UI suggestions, or architectural approaches.)*

---

## ℹ️ Additional Context

*(Any other information that may be helpful to understand the feature request, such as relevant AI platforms, specific use cases, or existing workflows.)*

---

## 🤖 AI Agent Directives Alignment

*(This section helps ensure new features align with the project's core architectural principles and technology stack. Please consider the following as you describe your feature:)*

### **Core Technology Stack:**
*   **Language:** JavaScript / TypeScript
*   **Environment:** Browser Extension / Library
*   **Key Technologies:** Vite, TailwindCSS v4, Tauri v2 (for potential future desktop wrapper), WXT (for extension development), Biome (Linting/Formatting), Vitest (Unit Testing), Playwright (E2E Testing).
*   **Architecture:** Feature-Sliced Design (FSD) is the standard.

### **Architectural Principles:** Ensure your proposed feature adheres to:
*   **SOLID Principles:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.
*   **DRY (Don't Repeat Yourself):** Avoid code duplication.
*   **YAGNI (You Ain't Gonna Need It):** Implement only what is necessary.

### **Verification:**
*   **Linting/Formatting:** Features should be easily lintable and formatable by Biome.
*   **Testing:** Consider how your feature could be unit-tested with Vitest and/or E2E tested with Playwright.

### **Integration Points:**
*   **AI Platform Interaction:** How does the feature interact with `iframe` embedding, query parameter injection, or `postMessage` communication?
*   **Data Extraction:** If applicable, how does it utilize `MutationObserver` or other DOM manipulation techniques for scraping AI responses?
*   **Cross-Platform Support:** How does it maintain compatibility across supported AI platforms (ChatGPT, Claude, Gemini, Perplexity AI, Grok AI, Copilot, Meta AI)?

---