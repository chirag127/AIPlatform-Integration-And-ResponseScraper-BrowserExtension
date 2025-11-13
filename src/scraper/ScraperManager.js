import { ChatGPTParser } from './parsers/ChatGPTParser.js';
import { ClaudeParser } from './parsers/ClaudeParser.js';
import { GeminiParser } from './parsers/GeminiParser.js';
import { PerplexityParser } from './parsers/PerplexityParser.js';
import { ContentObserver } from './ContentObserver.js';

export class ScraperManager {
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
        this.listeners = {
            status: [],
            error: []
        };
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
                        this.emit('status', { 
                            state: 'success', 
                            message: `Captured response from ${response.platform}` 
                        });
                    } catch (error) {
                        this.emit('error', { 
                            message: 'Failed to store response', 
                            error 
                        });
                    }
                });
                
                observer.start();
                this.observers.push(observer);
            }
        });

        if (this.observers.length === 0) {
            this.emit('status', { 
                state: 'warning', 
                message: 'No compatible platform detected. Monitoring for changes...' 
            });
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
