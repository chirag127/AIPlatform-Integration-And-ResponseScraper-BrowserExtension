// ==UserScript==
// @name         Consolidated AI Assistant
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Consolidated multi-AI platform companion with iframe integration, response scraping, and customizable preferences
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.openai.com
// @connect      api.anthropic.com
// @connect      generativelanguage.googleapis.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // BASE AI INTEGRATION
    // ============================================================================

    class BaseAIIntegration {
        constructor(config) {
            this.config = config;
            this.iframe = null;
            this.messageHandlers = new Map();
        }

        createIframe(container, prompt) {
            this.iframe = document.createElement('iframe');
            this.iframe.style.width = '100%';
            this.iframe.style.height = '100%';
            this.iframe.style.border = 'none';
            
            const url = this.buildUrl(prompt);
            this.iframe.src = url;
            
            if (this.config.supportsPostMessage) {
                this.setupPostMessageListener();
            }
            
            container.appendChild(this.iframe);
            return this.iframe;
        }

        buildUrl(prompt) {
            let url = this.config.baseUrl;
            
            if (prompt && this.config.supportsQueryParams && this.config.queryParamKey) {
                const separator = url.includes('?') ? '&' : '?';
                url += `${separator}${this.config.queryParamKey}=${encodeURIComponent(prompt)}`;
            }
            
            return url;
        }

        setupPostMessageListener() {
            window.addEventListener('message', (event) => {
                if (this.isValidOrigin(event.origin)) {
                    this.handleMessage(event.data);
                }
            });
        }

        isValidOrigin(origin) {
            return false;
        }

        handleMessage(data) {
            const handler = this.messageHandlers.get(data.type);
            if (handler) {
                handler(data.data);
            }
        }

        sendMessage(message) {
            if (this.iframe && this.config.supportsPostMessage) {
                this.iframe.contentWindow?.postMessage(message, this.config.baseUrl);
            }
        }

        onMessage(type, handler) {
            this.messageHandlers.set(type, handler);
        }

        destroy() {
            if (this.iframe && this.iframe.parentElement) {
                this.iframe.parentElement.removeChild(this.iframe);
            }
            this.iframe = null;
            this.messageHandlers.clear();
        }

        updatePrompt(prompt) {
            if (this.config.supportsQueryParams && this.iframe) {
                const url = this.buildUrl(prompt);
                this.iframe.src = url;
            } else if (this.config.supportsPostMessage) {
                this.sendMessage({ type: 'prompt', content: prompt });
            }
        }
    }

    // ============================================================================
    // AI PLATFORM INTEGRATIONS
    // ============================================================================

    class ChatGPTIntegration extends BaseAIIntegration {
        constructor() {
            super({
                name: 'ChatGPT',
                baseUrl: 'https://chat.openai.com/',
                supportsQueryParams: true,
                supportsPostMessage: false,
                queryParamKey: 'q'
            });
        }
        isValidOrigin(origin) {
            return origin === 'https://chat.openai.com' || origin === 'https://chatgpt.com';
        }
    }

    class ClaudeIntegration extends BaseAIIntegration {
        constructor() {
            super({
                name: 'Claude',
                baseUrl: 'https://claude.ai/',
                supportsQueryParams: false,
                supportsPostMessage: true
            });
        }
        isValidOrigin(origin) {
            return origin === 'https://claude.ai';
        }
    }

    class GeminiIntegration extends BaseAIIntegration {
        constructor() {
            super({
                name: 'Gemini',
                baseUrl: 'https://gemini.google.com/',
                supportsQueryParams: true,
                supportsPostMessage: false,
                queryParamKey: 'q'
            });
        }
        isValidOrigin(origin) {
            return origin === 'https://gemini.google.com';
        }
    }

    class PerplexityIntegration extends BaseAIIntegration {
        constructor() {
            super({
                name: 'Perplexity',
                baseUrl: 'https://www.perplexity.ai/',
                supportsQueryParams: true,
                supportsPostMessage: false,
                queryParamKey: 'q'
            });
        }
        isValidOrigin(origin) {
            return origin === 'https://www.perplexity.ai';
        }
    }

    class GrokIntegration extends BaseAIIntegration {
        constructor() {
            super({
                name: 'Grok',
                baseUrl: 'https://x.com/i/grok',
                supportsQueryParams: false,
                supportsPostMessage: true
            });
        }
        isValidOrigin(origin) {
            return origin === 'https://x.com' || origin === 'https://twitter.com';
        }
    }

    class CopilotIntegration extends BaseAIIntegration {
        constructor() {
            super({
                name: 'Copilot',
                baseUrl: 'https://copilot.microsoft.com/',
                supportsQueryParams: true,
                supportsPostMessage: false,
                queryParamKey: 'q'
            });
        }
        isValidOrigin(origin) {
            return origin === 'https://copilot.microsoft.com' || origin === 'https://www.bing.com';
        }
    }

    class MetaAIIntegration extends BaseAIIntegration {
        constructor() {
            super({
                name: 'Meta AI',
                baseUrl: 'https://www.meta.ai/',
                supportsQueryParams: true,
                supportsPostMessage: false,
                queryParamKey: 'prompt'
            });
        }
        isValidOrigin(origin) {
            return origin === 'https://www.meta.ai';
        }
    }

    // ============================================================================
    // RESPONSE STORE
    // ============================================================================

    class ResponseStore {
        constructor() {
            this.responses = [];
            this.listeners = { update: [], add: [] };
        }
        on(event, callback) {
            if (this.listeners[event]) {
                this.listeners[event].push(callback);
            }
        }
        emit(event, data) {
            if (this.listeners[event]) {
                this.listeners[event].forEach(callback => callback(data));
            }
        }
        addResponse(response) {
            const enrichedResponse = {
                ...response,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: Date.now()
            };
            this.responses.unshift(enrichedResponse);
            this.emit('add', enrichedResponse);
            this.emit('update', this.responses);
        }
        getResponses() {
            return [...this.responses];
        }
        clear() {
            this.responses = [];
            this.emit('update', this.responses);
        }
    }

    // ============================================================================
    // BASE PARSER
    // ============================================================================

    class BaseParser {
        constructor(platform, urlPattern) {
            this.platform = platform;
            this.urlPattern = urlPattern;
        }
        canParse(url) {
            return this.urlPattern.test(url);
        }
        getTargetNode() {
            return document.body;
        }
        findResponseNodes() {
            return [];
        }
        extractText(element) {
            if (!element) return '';
            const clone = element.cloneNode(true);
            const scripts = clone.querySelectorAll('script, style');
            scripts.forEach(el => el.remove());
            return clone.textContent.trim();
        }
        extractMetadata() {
            return {
                platform: this.platform,
                timestamp: Date.now(),
                url: window.location.href
            };
        }
    }

    // ============================================================================
    // PLATFORM PARSERS
    // ============================================================================

    class ChatGPTParser extends BaseParser {
        constructor() {
            super('ChatGPT', /chat\.openai\.com|chatgpt\.com/);
            this.lastProcessedContent = new Set();
        }
        getTargetNode() {
            return document.querySelector('main') || document.body;
        }
        findResponseNodes(rootNode) {
            const selectors = ['[data-message-author-role="assistant"]', '.agent-turn', '[class*="agent"]'];
            const nodes = [];
            for (const selector of selectors) {
                nodes.push(...Array.from(rootNode.querySelectorAll(selector)));
            }
            return nodes;
        }
        async parse(node) {
            const responseNodes = this.findResponseNodes(node);
            for (const responseNode of responseNodes) {
                const content = this.extractText(responseNode);
                if (content && content.length > 10 && !this.lastProcessedContent.has(content)) {
                    this.lastProcessedContent.add(content);
                    return {
                        ...this.extractMetadata(),
                        content,
                        model: 'ChatGPT',
                        conversationId: window.location.pathname.match(/\/c\/([^/]+)/)?.[1]
                    };
                }
            }
            return null;
        }
    }

    class ClaudeParser extends BaseParser {
        constructor() {
            super('Claude', /claude\.ai/);
            this.lastProcessedContent = new Set();
        }
        getTargetNode() {
            return document.querySelector('main') || document.body;
        }
        findResponseNodes(rootNode) {
            const selectors = ['[data-is-streaming]', '[class*="Message"][class*="assistant"]', 'div[class*="font-claude-message"]'];
            const nodes = [];
            for (const selector of selectors) {
                nodes.push(...Array.from(rootNode.querySelectorAll(selector)));
            }
            return nodes;
        }
        async parse(node) {
            const responseNodes = this.findResponseNodes(node);
            for (const responseNode of responseNodes) {
                const content = this.extractText(responseNode);
                if (content && content.length > 10 && !this.lastProcessedContent.has(content)) {
                    this.lastProcessedContent.add(content);
                    return {
                        ...this.extractMetadata(),
                        content,
                        model: 'Claude',
                        conversationId: window.location.pathname.match(/\/chat\/([^/]+)/)?.[1]
                    };
                }
            }
            return null;
        }
    }

    class GeminiParser extends BaseParser {
        constructor() {
            super('Gemini', /gemini\.google\.com/);
            this.lastProcessedContent = new Set();
        }
        getTargetNode() {
            return document.querySelector('main') || document.body;
        }
        findResponseNodes(rootNode) {
            const selectors = ['[class*="model-response"]', '[data-test-id*="model-response"]', 'message-content[class*="model"]'];
            const nodes = [];
            for (const selector of selectors) {
                nodes.push(...Array.from(rootNode.querySelectorAll(selector)));
            }
            return nodes;
        }
        async parse(node) {
            const responseNodes = this.findResponseNodes(node);
            for (const responseNode of responseNodes) {
                const content = this.extractText(responseNode);
                if (content && content.length > 10 && !this.lastProcessedContent.has(content)) {
                    this.lastProcessedContent.add(content);
                    return {
                        ...this.extractMetadata(),
                        content,
                        model: 'Gemini',
                        conversationId: window.location.search.match(/[?&]q=([^&]+)/)?.[1]
                    };
                }
            }
            return null;
        }
    }

    class PerplexityParser extends BaseParser {
        constructor() {
            super('Perplexity', /perplexity\.ai/);
            this.lastProcessedContent = new Set();
        }
        getTargetNode() {
            return document.querySelector('main') || document.body;
        }
        findResponseNodes(rootNode) {
            const selectors = ['[class*="answer"]', '[class*="response"]', 'div[class*="prose"]'];
            const nodes = [];
            for (const selector of selectors) {
                nodes.push(...Array.from(rootNode.querySelectorAll(selector)));
            }
            return nodes;
        }
        async parse(node) {
            const responseNodes = this.findResponseNodes(node);
            for (const responseNode of responseNodes) {
                const content = this.extractText(responseNode);
                if (content && content.length > 10 && !this.lastProcessedContent.has(content)) {
                    this.lastProcessedContent.add(content);
                    return {
                        ...this.extractMetadata(),
                        content,
                        model: 'Perplexity',
                        conversationId: null
                    };
                }
            }
            return null;
        }
    }

    // ============================================================================
    // CONTENT OBSERVER
    // ============================================================================

    class ContentObserver {
        constructor(parser, onResponse) {
            this.parser = parser;
            this.onResponse = onResponse;
            this.observer = null;
            this.processedNodes = new WeakSet();
            this.isProcessing = false;
        }
        start() {
            const targetNode = this.parser.getTargetNode();
            if (!targetNode) return;
            this.observer = new MutationObserver((mutations) => this.handleMutations(mutations));
            this.observer.observe(targetNode, { childList: true, subtree: true, characterData: true });
            this.scanExisting();
        }
        stop() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
        async handleMutations(mutations) {
            if (this.isProcessing) return;
            this.isProcessing = true;
            try {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                await this.processNode(node);
                            }
                        }
                    }
                }
            } finally {
                this.isProcessing = false;
            }
        }
        async processNode(node) {
            if (this.processedNodes.has(node)) return;
            try {
                const response = await this.parser.parse(node);
                if (response && response.content && response.content.trim().length > 0) {
                    this.processedNodes.add(node);
                    this.onResponse(response);
                }
            } catch (error) {
                console.error('Error parsing node:', error);
            }
        }
        scanExisting() {
            const targetNode = this.parser.getTargetNode();
            if (!targetNode) return;
            const responseNodes = this.parser.findResponseNodes(targetNode);
            responseNodes.forEach(node => this.processNode(node));
        }
    }

    // ============================================================================
    // SCRAPER MANAGER
    // ============================================================================

    class ScraperManager {
        constructor(store) {
            this.store = store;
            this.observers = [];
            this.parsers = [
                new ChatGPTParser(),
                new ClaudeParser(),
                new GeminiParser(),
                new PerplexityParser()
            ];
            this.isRunning = false;
            this.listeners = { status: [], error: [] };
        }
        on(event, callback) {
            if (this.listeners[event]) {
                this.listeners[event].push(callback);
            }
        }
        emit(event, data) {
            if (this.listeners[event]) {
                this.listeners[event].forEach(callback => callback(data));
            }
        }
        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            this.emit('status', { state: 'running', message: 'Scraping started...' });
            this.parsers.forEach(parser => {
                if (parser.canParse(window.location.href)) {
                    const observer = new ContentObserver(parser, (response) => {
                        try {
                            this.store.addResponse(response);
                            this.emit('status', { state: 'success', message: `Captured response from ${response.platform}` });
                        } catch (error) {
                            this.emit('error', { message: 'Failed to store response', error });
                        }
                    });
                    observer.start();
                    this.observers.push(observer);
                }
            });
            if (this.observers.length === 0) {
                this.emit('status', { state: 'warning', message: 'No compatible platform detected' });
            }
        }
        stop() {
            if (!this.isRunning) return;
            this.observers.forEach(observer => observer.stop());
            this.observers = [];
            this.isRunning = false;
            this.emit('status', { state: 'stopped', message: 'Scraping stopped' });
        }
    }

    // ============================================================================
    // USER PREFERENCES
    // ============================================================================

    const AI_PLATFORMS = {
        chatgpt: { name: 'ChatGPT', enabled: true, integration: ChatGPTIntegration },
        claude: { name: 'Claude', enabled: true, integration: ClaudeIntegration },
        gemini: { name: 'Gemini', enabled: true, integration: GeminiIntegration },
        perplexity: { name: 'Perplexity', enabled: true, integration: PerplexityIntegration },
        grok: { name: 'Grok', enabled: true, integration: GrokIntegration },
        copilot: { name: 'Copilot', enabled: true, integration: CopilotIntegration },
        metaai: { name: 'Meta AI', enabled: true, integration: MetaAIIntegration }
    };

    const DEFAULT_SETTINGS = {
        platforms: AI_PLATFORMS,
        autoScrape: true,
        showIframePanel: false,
        panelPosition: { x: 20, y: 20 },
        panelSize: { width: 400, height: 600 }
    };

    // ============================================================================
    // MAIN APPLICATION
    // ============================================================================

    class ConsolidatedAIAssistant {
        constructor() {
            this.settings = this.loadSettings();
            this.store = new ResponseStore();
            this.scraperManager = new ScraperManager(this.store);
            this.panel = null;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.activeIntegrations = new Map();
            this.init();
        }

        loadSettings() {
            const saved = GM_getValue('aiAssistantSettings');
            return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
        }

        saveSettings() {
            GM_setValue('aiAssistantSettings', JSON.stringify(this.settings));
        }

        init() {
            this.createPanel();
            this.setupEventListeners();
            
            if (this.settings.autoScrape) {
                setTimeout(() => this.scraperManager.start(), 1000);
            }

            this.store.on('update', () => this.renderResponses());
            this.scraperManager.on('status', (status) => this.updateStatus(status));
            this.scraperManager.on('error', (error) => this.showError(error));
        }

        createPanel() {
            this.panel = document.createElement('div');
            this.panel.id = 'consolidated-ai-panel';
            this.panel.style.cssText = `
                position: fixed;
                left: ${this.settings.panelPosition.x}px;
                top: ${this.settings.panelPosition.y}px;
                width: ${this.settings.panelSize.width}px;
                height: ${this.settings.panelSize.height}px;
                background: #1e1e1e;
                border: 1px solid #333;
                border-radius: 8px;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                resize: both;
                overflow: hidden;
            `;

            this.panel.appendChild(this.createHeader());
            this.panel.appendChild(this.createContent());
            this.panel.appendChild(this.createStatusBar());
            this.panel.appendChild(this.createControls());

            document.body.appendChild(this.panel);
            this.setupDragging();
            this.setupResizing();
        }

        createHeader() {
            const header = document.createElement('div');
            header.style.cssText = `
                background: #2d2d2d;
                padding: 12px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #333;
                user-select: none;
            `;

            const title = document.createElement('span');
            title.textContent = 'AI Assistant';
            title.style.cssText = 'color: #fff; font-weight: 600; font-size: 14px;';

            const controls = document.createElement('div');
            controls.style.cssText = 'display: flex; gap: 8px;';

            const settingsBtn = this.createHeaderButton('⚙️', () => this.toggleSettings());
            const minimizeBtn = this.createHeaderButton('−', () => this.toggleMinimize());
            const closeBtn = this.createHeaderButton('×', () => this.panel.style.display = 'none');

            controls.appendChild(settingsBtn);
            controls.appendChild(minimizeBtn);
            controls.appendChild(closeBtn);
            header.appendChild(title);
            header.appendChild(controls);

            return header;
        }

        createHeaderButton(text, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                background: transparent;
                border: none;
                color: #fff;
                cursor: pointer;
                font-size: 16px;
                padding: 4px 8px;
                opacity: 0.8;
            `;
            btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
            btn.addEventListener('mouseleave', () => btn.style.opacity = '0.8');
            btn.addEventListener('click', onClick);
            return btn;
        }

        createContent() {
            const content = document.createElement('div');
            content.id = 'ai-responses';
            content.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                color: #e0e0e0;
            `;

            const emptyState = document.createElement('div');
            emptyState.id = 'empty-state';
            emptyState.textContent = 'No responses captured yet. Visit an AI platform to start.';
            emptyState.style.cssText = `
                text-align: center;
                color: #888;
                padding: 40px 20px;
                font-size: 14px;
            `;

            content.appendChild(emptyState);
            return content;
        }

        createStatusBar() {
            const statusBar = document.createElement('div');
            statusBar.style.cssText = `
                padding: 8px 12px;
                background: #2d2d2d;
                border-top: 1px solid #333;
                font-size: 12px;
                color: #888;
            `;

            const statusText = document.createElement('span');
            statusText.id = 'status-text';
            statusText.textContent = 'Ready';

            statusBar.appendChild(statusText);
            return statusBar;
        }

        createControls() {
            const controls = document.createElement('div');
            controls.style.cssText = `
                padding: 12px;
                background: #2d2d2d;
                border-top: 1px solid #333;
                display: flex;
                gap: 8px;
            `;

            const startBtn = this.createButton('Start', '#0066cc', () => this.scraperManager.start());
            const stopBtn = this.createButton('Stop', '#cc0000', () => this.scraperManager.stop());
            const clearBtn = this.createButton('Clear', '#666', () => this.store.clear());

            controls.appendChild(startBtn);
            controls.appendChild(stopBtn);
            controls.appendChild(clearBtn);

            return controls;
        }

        createButton(text, bgColor, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                flex: 1;
                background: ${bgColor};
                border: none;
                color: #fff;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
            `;
            btn.addEventListener('mouseenter', () => btn.style.opacity = '0.8');
            btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
            btn.addEventListener('click', onClick);
            return btn;
        }

        setupDragging() {
            const header = this.panel.firstChild;
            header.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.dragOffset.x = e.clientX - this.panel.offsetLeft;
                this.dragOffset.y = e.clientY - this.panel.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    this.panel.style.left = (e.clientX - this.dragOffset.x) + 'px';
                    this.panel.style.top = (e.clientY - this.dragOffset.y) + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.settings.panelPosition = {
                        x: this.panel.offsetLeft,
                        y: this.panel.offsetTop
                    };
                    this.saveSettings();
                }
            });
        }

        setupResizing() {
            const observer = new ResizeObserver(() => {
                this.settings.panelSize = {
                    width: this.panel.offsetWidth,
                    height: this.panel.offsetHeight
                };
                this.saveSettings();
            });
            observer.observe(this.panel);
        }

        setupEventListeners() {}

        renderResponses() {
            const content = document.getElementById('ai-responses');
            const emptyState = document.getElementById('empty-state');
            const responses = this.store.getResponses();

            if (responses.length === 0) {
                emptyState.style.display = 'block';
                Array.from(content.children).forEach(child => {
                    if (child.id !== 'empty-state') child.remove();
                });
                return;
            }

            emptyState.style.display = 'none';

            responses.forEach(response => {
                if (!document.getElementById(`response-${response.id}`)) {
                    const responseDiv = this.createResponseElement(response);
                    content.appendChild(responseDiv);
                }
            });
        }

        createResponseElement(response) {
            const div = document.createElement('div');
            div.id = `response-${response.id}`;
            div.style.cssText = `
                background: #2d2d2d;
                border: 1px solid #444;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 12px;
            `;

            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 12px;
            `;

            const platform = document.createElement('span');
            platform.textContent = response.platform;
            platform.style.cssText = 'font-weight: 600; color: #4a9eff;';

            const time = document.createElement('span');
            time.textContent = new Date(response.timestamp).toLocaleTimeString();
            time.style.cssText = 'color: #888;';

            header.appendChild(platform);
            header.appendChild(time);

            const content = document.createElement('div');
            content.textContent = response.content.substring(0, 200) + (response.content.length > 200 ? '...' : '');
            content.style.cssText = 'font-size: 14px; line-height: 1.5; white-space: pre-wrap;';

            div.appendChild(header);
            div.appendChild(content);

            return div;
        }

        updateStatus(status) {
            const statusText = document.getElementById('status-text');
            if (statusText) {
                statusText.textContent = status.message;
                statusText.style.color = status.state === 'success' ? '#4ade80' : status.state === 'error' ? '#f87171' : '#888';
            }
        }

        showError(error) {
            this.updateStatus({ state: 'error', message: error.message });
        }

        toggleSettings() {
            alert('Settings panel not implemented in this consolidated version');
        }

        toggleMinimize() {
            const content = document.getElementById('ai-responses');
            const statusBar = this.panel.children[2];
            const controls = this.panel.children[3];
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            statusBar.style.display = isHidden ? 'block' : 'none';
            controls.style.display = isHidden ? 'flex' : 'none';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ConsolidatedAIAssistant());
    } else {
        new ConsolidatedAIAssistant();
    }
})();