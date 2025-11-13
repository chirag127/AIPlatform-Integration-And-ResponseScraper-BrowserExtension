export class BaseParser {
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

    async parse() {
        throw new Error('parse() must be implemented by subclass');
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
