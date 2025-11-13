// ==UserScript==
// @name         Search AI Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  AI-powered assistant for Google and Bing search results
// @author       You
// @match        https://www.google.com/search*
// @match        https://www.bing.com/search*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Platform detection utilities
    const Platform = {
        GOOGLE: 'google',
        BING: 'bing',
        UNKNOWN: 'unknown'
    };

    function detectPlatform() {
        const hostname = window.location.hostname;
        if (hostname.includes('google.com')) {
            return Platform.GOOGLE;
        } else if (hostname.includes('bing.com')) {
            return Platform.BING;
        }
        return Platform.UNKNOWN;
    }

    // Query extraction logic
    function extractSearchQuery() {
        const platform = detectPlatform();
        const params = new URLSearchParams(window.location.search);

        switch (platform) {
            case Platform.GOOGLE:
                return params.get('q') || '';
            case Platform.BING:
                return params.get('q') || '';
            default:
                return '';
        }
    }

    // UI container generation (collapsible sidebar panel)
    function createSidebarPanel() {
        const container = document.createElement('div');
        container.id = 'ai-assistant-sidebar';
        container.className = 'ai-assistant-collapsed';
        
        container.innerHTML = `
            <div class="ai-assistant-toggle" id="ai-assistant-toggle">
                <span class="toggle-icon">◀</span>
            </div>
            <div class="ai-assistant-content">
                <div class="ai-assistant-header">
                    <h3>AI Assistant</h3>
                </div>
                <div class="ai-assistant-body">
                    <div class="query-display">
                        <strong>Query:</strong> <span id="ai-query-text"></span>
                    </div>
                    <div class="ai-response" id="ai-response">
                        <p>Ready to assist with your search.</p>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #ai-assistant-sidebar {
                position: fixed;
                right: 0;
                top: 0;
                height: 100vh;
                width: 400px;
                background: #ffffff;
                border-left: 1px solid #ddd;
                box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                display: flex;
                transition: transform 0.3s ease;
            }

            #ai-assistant-sidebar.ai-assistant-collapsed {
                transform: translateX(360px);
            }

            .ai-assistant-toggle {
                width: 40px;
                background: #4285f4;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                user-select: none;
                font-size: 20px;
                flex-shrink: 0;
            }

            .ai-assistant-toggle:hover {
                background: #3367d6;
            }

            .ai-assistant-collapsed .toggle-icon::before {
                content: '◀';
            }

            .ai-assistant-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .ai-assistant-header {
                padding: 16px;
                border-bottom: 1px solid #ddd;
                background: #f8f9fa;
            }

            .ai-assistant-header h3 {
                margin: 0;
                font-size: 18px;
                color: #202124;
            }

            .ai-assistant-body {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
            }

            .query-display {
                margin-bottom: 16px;
                padding: 12px;
                background: #f1f3f4;
                border-radius: 4px;
                font-size: 14px;
            }

            .query-display strong {
                display: block;
                margin-bottom: 4px;
                color: #5f6368;
            }

            #ai-query-text {
                color: #202124;
                word-break: break-word;
            }

            .ai-response {
                font-size: 14px;
                line-height: 1.6;
                color: #202124;
            }

            .ai-response p {
                margin: 0 0 12px 0;
            }

            .ai-response p:last-child {
                margin-bottom: 0;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(container);

        // Toggle functionality
        const toggle = container.querySelector('#ai-assistant-toggle');
        toggle.addEventListener('click', () => {
            container.classList.toggle('ai-assistant-collapsed');
            const icon = toggle.querySelector('.toggle-icon');
            if (container.classList.contains('ai-assistant-collapsed')) {
                icon.textContent = '◀';
            } else {
                icon.textContent = '▶';
            }
        });

        return container;
    }

    // Initialize the userscript
    function init() {
        const platform = detectPlatform();
        if (platform === Platform.UNKNOWN) {
            console.log('AI Assistant: Unknown platform');
            return;
        }

        const query = extractSearchQuery();
        if (!query) {
            console.log('AI Assistant: No search query found');
            return;
        }

        const sidebar = createSidebarPanel();
        const queryText = sidebar.querySelector('#ai-query-text');
        queryText.textContent = query;

        console.log(`AI Assistant initialized on ${platform} with query: ${query}`);
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
