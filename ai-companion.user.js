// ==UserScript==
// @name         AI Companion with Preferences
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Multi-AI platform companion with customizable preferences
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.openai.com
// @connect      api.anthropic.com
// @connect      generativelanguage.googleapis.com
// ==/UserScript==

(function() {
    'use strict';

    const AI_PLATFORMS = {
        chatgpt: { name: 'ChatGPT', enabled: true },
        claude: { name: 'Claude', enabled: true },
        gemini: { name: 'Gemini', enabled: true },
        perplexity: { name: 'Perplexity', enabled: true }
    };

    const DEFAULT_SETTINGS = {
        platforms: AI_PLATFORMS,
        autoQuery: true,
        panelPosition: { x: 20, y: 20 },
        panelSize: { width: 400, height: 600 }
    };

    class AICompanion {
        constructor() {
            this.settings = this.loadSettings();
            this.panel = null;
            this.isDragging = false;
            this.isResizing = false;
            this.dragOffset = { x: 0, y: 0 };
            this.init();
        }

        loadSettings() {
            const saved = GM_getValue('aiCompanionSettings');
            return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
        }

        saveSettings() {
            GM_setValue('aiCompanionSettings', JSON.stringify(this.settings));
        }

        init() {
            this.createPanel();
            this.createSettingsUI();
            if (this.settings.autoQuery) {
                this.setupAutoQuery();
            }
        }

        createPanel() {
            this.panel = document.createElement('div');
            this.panel.id = 'ai-companion-panel';
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
            title.textContent = 'AI Companion';
            title.style.cssText = 'color: #fff; font-weight: 600; font-size: 14px;';

            const controls = document.createElement('div');
            controls.style.cssText = 'display: flex; gap: 8px;';

            const settingsBtn = this.createButton('⚙️', () => this.toggleSettings());
            const minimizeBtn = this.createButton('−', () => this.toggleMinimize());
            const closeBtn = this.createButton('×', () => this.panel.style.display = 'none');

            controls.appendChild(settingsBtn);
            controls.appendChild(minimizeBtn);
            controls.appendChild(closeBtn);
            header.appendChild(title);
            header.appendChild(controls);

            const content = document.createElement('div');
            content.id = 'ai-companion-content';
            content.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                color: #e0e0e0;
            `;

            const responseArea = document.createElement('div');
            responseArea.id = 'ai-responses';
            responseArea.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

            content.appendChild(responseArea);

            const inputArea = document.createElement('div');
            inputArea.style.cssText = `
                padding: 12px;
                background: #2d2d2d;
                border-top: 1px solid #333;
                display: flex;
                gap: 8px;
            `;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Ask AI...';
            input.style.cssText = `
                flex: 1;
                background: #1e1e1e;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 8px 12px;
                color: #fff;
                outline: none;
            `;
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.queryAI(input.value);
            });

            const sendBtn = this.createButton('Send', () => this.queryAI(input.value));
            sendBtn.style.cssText += 'padding: 8px 16px; background: #0066cc; border-radius: 4px;';

            inputArea.appendChild(input);
            inputArea.appendChild(sendBtn);

            this.panel.appendChild(header);
            this.panel.appendChild(content);
            this.panel.appendChild(inputArea);

            document.body.appendChild(this.panel);

            this.setupDragging(header);
            this.setupResizing();
        }

        createButton(text, onClick) {
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
                transition: opacity 0.2s;
            `;
            btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
            btn.addEventListener('mouseleave', () => btn.style.opacity = '0.8');
            btn.addEventListener('click', onClick);
            return btn;
        }

        createSettingsUI() {
            const modal = document.createElement('div');
            modal.id = 'ai-companion-settings-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 1000000;
            `;

            const settingsPanel = document.createElement('div');
            settingsPanel.style.cssText = `
                background: #1e1e1e;
                border: 1px solid #333;
                border-radius: 8px;
                padding: 24px;
                max-width: 500px;
                width: 90%;
                color: #e0e0e0;
                max-height: 80vh;
                overflow-y: auto;
            `;

            const title = document.createElement('h2');
            title.textContent = 'Settings';
            title.style.cssText = 'margin: 0 0 20px 0; color: #fff;';

            const platformsSection = this.createPlatformsSection();
            const autoQuerySection = this.createAutoQuerySection();
            const positionSection = this.createPositionSection();
            const sizeSection = this.createSizeSection();

            const buttonsDiv = document.createElement('div');
            buttonsDiv.style.cssText = 'display: flex; gap: 12px; margin-top: 20px; justify-content: flex-end;';

            const saveBtn = this.createButton('Save', () => {
                this.saveSettings();
                this.applySettings();
                modal.style.display = 'none';
            });
            saveBtn.style.cssText += 'padding: 8px 16px; background: #0066cc; border-radius: 4px;';

            const cancelBtn = this.createButton('Cancel', () => {
                this.settings = this.loadSettings();
                modal.style.display = 'none';
            });
            cancelBtn.style.cssText += 'padding: 8px 16px; background: #444; border-radius: 4px;';

            buttonsDiv.appendChild(cancelBtn);
            buttonsDiv.appendChild(saveBtn);

            settingsPanel.appendChild(title);
            settingsPanel.appendChild(platformsSection);
            settingsPanel.appendChild(autoQuerySection);
            settingsPanel.appendChild(positionSection);
            settingsPanel.appendChild(sizeSection);
            settingsPanel.appendChild(buttonsDiv);

            modal.appendChild(settingsPanel);
            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });
        }

        createPlatformsSection() {
            const section = document.createElement('div');
            section.style.cssText = 'margin-bottom: 20px;';

            const label = document.createElement('h3');
            label.textContent = 'AI Platforms';
            label.style.cssText = 'margin: 0 0 12px 0; font-size: 16px; color: #fff;';

            section.appendChild(label);

            Object.keys(this.settings.platforms).forEach(key => {
                const platform = this.settings.platforms[key];
                const div = document.createElement('div');
                div.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px;';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = platform.enabled;
                checkbox.style.cssText = 'margin-right: 8px; cursor: pointer;';
                checkbox.addEventListener('change', () => {
                    this.settings.platforms[key].enabled = checkbox.checked;
                });

                const text = document.createElement('span');
                text.textContent = platform.name;

                div.appendChild(checkbox);
                div.appendChild(text);
                section.appendChild(div);
            });

            return section;
        }

        createAutoQuerySection() {
            const section = document.createElement('div');
            section.style.cssText = 'margin-bottom: 20px;';

            const label = document.createElement('h3');
            label.textContent = 'Auto Query';
            label.style.cssText = 'margin: 0 0 12px 0; font-size: 16px; color: #fff;';

            const div = document.createElement('div');
            div.style.cssText = 'display: flex; align-items: center;';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = this.settings.autoQuery;
            checkbox.style.cssText = 'margin-right: 8px; cursor: pointer;';
            checkbox.addEventListener('change', () => {
                this.settings.autoQuery = checkbox.checked;
            });

            const text = document.createElement('span');
            text.textContent = 'Enable automatic querying on page load';

            div.appendChild(checkbox);
            div.appendChild(text);
            section.appendChild(label);
            section.appendChild(div);

            return section;
        }

        createPositionSection() {
            const section = document.createElement('div');
            section.style.cssText = 'margin-bottom: 20px;';

            const label = document.createElement('h3');
            label.textContent = 'Panel Position';
            label.style.cssText = 'margin: 0 0 12px 0; font-size: 16px; color: #fff;';

            const controls = document.createElement('div');
            controls.style.cssText = 'display: flex; gap: 12px;';

            const xInput = this.createNumberInput('X:', this.settings.panelPosition.x, (val) => {
                this.settings.panelPosition.x = val;
            });

            const yInput = this.createNumberInput('Y:', this.settings.panelPosition.y, (val) => {
                this.settings.panelPosition.y = val;
            });

            controls.appendChild(xInput);
            controls.appendChild(yInput);
            section.appendChild(label);
            section.appendChild(controls);

            return section;
        }

        createSizeSection() {
            const section = document.createElement('div');
            section.style.cssText = 'margin-bottom: 20px;';

            const label = document.createElement('h3');
            label.textContent = 'Panel Size';
            label.style.cssText = 'margin: 0 0 12px 0; font-size: 16px; color: #fff;';

            const controls = document.createElement('div');
            controls.style.cssText = 'display: flex; gap: 12px;';

            const widthInput = this.createNumberInput('Width:', this.settings.panelSize.width, (val) => {
                this.settings.panelSize.width = val;
            });

            const heightInput = this.createNumberInput('Height:', this.settings.panelSize.height, (val) => {
                this.settings.panelSize.height = val;
            });

            controls.appendChild(widthInput);
            controls.appendChild(heightInput);
            section.appendChild(label);
            section.appendChild(controls);

            return section;
        }

        createNumberInput(labelText, value, onChange) {
            const div = document.createElement('div');
            div.style.cssText = 'display: flex; align-items: center; gap: 8px;';

            const label = document.createElement('span');
            label.textContent = labelText;

            const input = document.createElement('input');
            input.type = 'number';
            input.value = value;
            input.style.cssText = `
                background: #2d2d2d;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 4px 8px;
                color: #fff;
                width: 80px;
            `;
            input.addEventListener('change', () => onChange(parseInt(input.value)));

            div.appendChild(label);
            div.appendChild(input);
            return div;
        }

        setupDragging(header) {
            header.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.dragOffset.x = e.clientX - this.panel.offsetLeft;
                this.dragOffset.y = e.clientY - this.panel.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    const x = e.clientX - this.dragOffset.x;
                    const y = e.clientY - this.dragOffset.y;
                    this.panel.style.left = x + 'px';
                    this.panel.style.top = y + 'px';
                    this.settings.panelPosition = { x, y };
                }
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.saveSettings();
                }
            });
        }

        setupResizing() {
            const observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.target === this.panel) {
                        this.settings.panelSize = {
                            width: this.panel.offsetWidth,
                            height: this.panel.offsetHeight
                        };
                        this.saveSettings();
                    }
                }
            });
            observer.observe(this.panel);
        }

        toggleSettings() {
            const modal = document.getElementById('ai-companion-settings-modal');
            modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
        }

        toggleMinimize() {
            const content = document.getElementById('ai-companion-content');
            const inputArea = this.panel.querySelector('div:last-child');
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            inputArea.style.display = isHidden ? 'flex' : 'none';
        }

        applySettings() {
            this.panel.style.left = this.settings.panelPosition.x + 'px';
            this.panel.style.top = this.settings.panelPosition.y + 'px';
            this.panel.style.width = this.settings.panelSize.width + 'px';
            this.panel.style.height = this.settings.panelSize.height + 'px';
        }

        setupAutoQuery() {
            const pageTitle = document.title;
            if (pageTitle) {
                setTimeout(() => {
                    this.queryAI(`Summarize the key information from: ${pageTitle}`);
                }, 2000);
            }
        }

        queryAI(query) {
            if (!query) return;

            const responsesDiv = document.getElementById('ai-responses');
            responsesDiv.innerHTML = '';

            Object.keys(this.settings.platforms).forEach(key => {
                const platform = this.settings.platforms[key];
                if (platform.enabled) {
                    this.addPlatformResponse(platform.name, 'Loading...');
                }
            });

            Object.keys(this.settings.platforms).forEach(key => {
                const platform = this.settings.platforms[key];
                if (platform.enabled) {
                    this.mockQueryPlatform(key, query);
                }
            });
        }

        mockQueryPlatform(platform, query) {
            setTimeout(() => {
                const platformName = this.settings.platforms[platform].name;
                const mockResponse = `${platformName} response to: "${query}"\n\nThis is a mock response. To enable actual API calls, add your API keys and implement the API integration.`;
                this.updatePlatformResponse(platformName, mockResponse);
            }, 1000 + Math.random() * 2000);
        }

        addPlatformResponse(platformName, content) {
            const responsesDiv = document.getElementById('ai-responses');
            const div = document.createElement('div');
            div.id = `response-${platformName}`;
            div.style.cssText = `
                background: #2d2d2d;
                border: 1px solid #444;
                border-radius: 6px;
                padding: 12px;
            `;

            const header = document.createElement('div');
            header.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #4a9eff;';
            header.textContent = platformName;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'response-content';
            contentDiv.style.cssText = 'font-size: 14px; line-height: 1.5; white-space: pre-wrap;';
            contentDiv.textContent = content;

            div.appendChild(header);
            div.appendChild(contentDiv);
            responsesDiv.appendChild(div);
        }

        updatePlatformResponse(platformName, content) {
            const div = document.getElementById(`response-${platformName}`);
            if (div) {
                const contentDiv = div.querySelector('.response-content');
                contentDiv.textContent = content;
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new AICompanion());
    } else {
        new AICompanion();
    }
})();
