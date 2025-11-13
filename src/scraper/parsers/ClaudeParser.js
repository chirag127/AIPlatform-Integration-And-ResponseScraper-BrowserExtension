import { BaseParser } from './BaseParser.js';

export class ClaudeParser extends BaseParser {
    constructor() {
        super('Claude', /claude\.ai/);
        this.lastProcessedContent = new Set();
    }

    getTargetNode() {
        return document.querySelector('main') || document.body;
    }

    findResponseNodes(rootNode) {
        const selectors = [
            '[data-is-streaming]',
            '[class*="Message"][class*="assistant"]',
            'div[class*="font-claude-message"]'
        ];

        const nodes = [];
        for (const selector of selectors) {
            const found = rootNode.querySelectorAll(selector);
            nodes.push(...Array.from(found));
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
                    ...this.extractMetadata(responseNode),
                    content,
                    model: this.extractModel(),
                    conversationId: this.extractConversationId()
                };
            }
        }

        return null;
    }

    extractModel() {
        const modelDisplay = document.querySelector('[class*="model"]');
        return modelDisplay ? modelDisplay.textContent.trim() : 'Claude';
    }

    extractConversationId() {
        const match = window.location.pathname.match(/\/chat\/([^/]+)/);
        return match ? match[1] : null;
    }
}
