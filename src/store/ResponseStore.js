export class ResponseStore {
    constructor() {
        this.responses = [];
        this.listeners = {
            update: [],
            add: []
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

    addResponse(response) {
        const enrichedResponse = {
            ...response,
            id: this.generateId(),
            timestamp: Date.now()
        };
        
        this.responses.unshift(enrichedResponse);
        this.emit('add', enrichedResponse);
        this.emit('update', this.responses);
    }

    getResponses() {
        return [...this.responses];
    }

    getResponse(id) {
        return this.responses.find(r => r.id === id);
    }

    clear() {
        this.responses = [];
        this.emit('update', this.responses);
    }

    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
