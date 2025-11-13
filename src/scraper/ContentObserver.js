export class ContentObserver {
    constructor(parser, onResponse) {
        this.parser = parser;
        this.onResponse = onResponse;
        this.observer = null;
        this.processedNodes = new WeakSet();
        this.isProcessing = false;
    }

    start() {
        const targetNode = this.parser.getTargetNode();
        if (!targetNode) {
            console.warn(`Target node not found for ${this.parser.constructor.name}`);
            return;
        }

        const config = {
            childList: true,
            subtree: true,
            characterData: true,
            characterDataOldValue: false
        };

        this.observer = new MutationObserver((mutations) => {
            this.handleMutations(mutations);
        });

        this.observer.observe(targetNode, config);
        
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
        } catch (error) {
            console.error('Error processing mutations:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    async processNode(node) {
        if (this.processedNodes.has(node)) return;

        try {
            const response = await this.parser.parse(node);
            
            if (response && this.isValidResponse(response)) {
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

    isValidResponse(response) {
        return response && 
               response.content && 
               response.content.trim().length > 0 &&
               response.platform;
    }
}
