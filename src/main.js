import { ScraperManager } from './scraper/ScraperManager.js';
import { UIManager } from './ui/UIManager.js';
import { ResponseStore } from './store/ResponseStore.js';

class App {
    constructor() {
        this.store = new ResponseStore();
        this.scraperManager = new ScraperManager(this.store);
        this.uiManager = new UIManager(this.store);
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.uiManager.render();
        
        this.store.on('update', () => {
            this.uiManager.render();
        });

        this.scraperManager.on('status', (status) => {
            this.uiManager.updateStatus(status);
        });

        this.scraperManager.on('error', (error) => {
            this.uiManager.showError(error);
        });
    }

    setupEventListeners() {
        document.getElementById('startScraping').addEventListener('click', () => {
            this.scraperManager.start();
        });

        document.getElementById('stopScraping').addEventListener('click', () => {
            this.scraperManager.stop();
        });

        document.getElementById('clearResponses').addEventListener('click', () => {
            this.store.clear();
        });

        document.getElementById('tabView').addEventListener('click', () => {
            this.uiManager.switchView('tab');
        });

        document.getElementById('accordionView').addEventListener('click', () => {
            this.uiManager.switchView('accordion');
        });
    }
}

new App();
