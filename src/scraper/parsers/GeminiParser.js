import { BaseParser } from './BaseParser.js';

export class GeminiParser extends BaseParser {
    constructor() {
        super('Gemini', /gemini\.google\.com/);
        this.lastProcessedContent = new Set();
    }

    getTargetNode() {
        return document.querySelector('main') || document.body;
    }

    findResponseNodes(rootNode) {
        const selectors = [
            '[class*="model-response"]',
            '[data-test-id*="model-response"]',
            'message-content[class*="model"]'
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
                    model: 'Gemini',
                    conversationId: this.extractConversationId()
                };
            }
        }

        return null;
    }

    extractConversationId() {
        const match = window.location.search.match(/[?&]q=([^&]+)/);
        return match ? match[1] : null;
    }
}
