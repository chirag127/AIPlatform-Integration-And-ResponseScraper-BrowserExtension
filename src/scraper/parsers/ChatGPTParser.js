import { BaseParser } from './BaseParser.js';

export class ChatGPTParser extends BaseParser {
    constructor() {
        super('ChatGPT', /chat\.openai\.com|chatgpt\.com/);
        this.lastProcessedContent = new Set();
    }

    getTargetNode() {
        return document.querySelector('main') || document.body;
    }

    findResponseNodes(rootNode) {
        const selectors = [
            '[data-message-author-role="assistant"]',
            '.agent-turn',
            '[class*="agent"]'
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
                    model: this.extractModel(responseNode),
                    conversationId: this.extractConversationId()
                };
            }
        }

        return null;
    }

    extractModel() {
        const modelButton = document.querySelector('[class*="model"]');
        return modelButton ? modelButton.textContent.trim() : 'Unknown';
    }

    extractConversationId() {
        const match = window.location.pathname.match(/\/c\/([^/]+)/);
        return match ? match[1] : null;
    }
}
