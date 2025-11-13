import { BaseParser } from './BaseParser.js';

export class PerplexityParser extends BaseParser {
    constructor() {
        super('Perplexity', /perplexity\.ai/);
        this.lastProcessedContent = new Set();
    }

    getTargetNode() {
        return document.querySelector('main') || document.body;
    }

    findResponseNodes(rootNode) {
        const selectors = [
            '[class*="answer"]',
            '[class*="response"]',
            'div[class*="prose"]'
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
                    model: 'Perplexity',
                    conversationId: null
                };
            }
        }

        return null;
    }
}
