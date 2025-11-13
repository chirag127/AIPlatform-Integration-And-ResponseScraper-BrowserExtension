export class UIManager {
    constructor(store) {
        this.store = store;
        this.currentView = 'tab';
        this.selectedTab = null;
    }

    switchView(viewType) {
        this.currentView = viewType;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        if (viewType === 'tab') {
            document.getElementById('tabView').classList.add('active');
            document.getElementById('tabViewContainer').style.display = 'block';
            document.getElementById('accordionViewContainer').style.display = 'none';
        } else {
            document.getElementById('accordionView').classList.add('active');
            document.getElementById('tabViewContainer').style.display = 'none';
            document.getElementById('accordionViewContainer').style.display = 'block';
        }

        this.render();
    }

    render() {
        const responses = this.store.getResponses();
        
        if (responses.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();
        this.updateResponseCount(responses.length);

        if (this.currentView === 'tab') {
            this.renderTabView(responses);
        } else {
            this.renderAccordionView(responses);
        }
    }

    renderTabView(responses) {
        const tabList = document.getElementById('tabList');
        const tabContent = document.getElementById('tabContent');

        tabList.innerHTML = '';
        tabContent.innerHTML = '';

        responses.forEach((response, index) => {
            const tab = this.createTab(response, index);
            tabList.appendChild(tab);

            const content = this.createTabContent(response, index);
            tabContent.appendChild(content);
        });

        if (!this.selectedTab && responses.length > 0) {
            this.selectTab(0);
        }
    }

    renderAccordionView(responses) {
        const accordionContent = document.getElementById('accordionContent');
        accordionContent.innerHTML = '';

        responses.forEach((response, index) => {
            const item = this.createAccordionItem(response, index);
            accordionContent.appendChild(item);
        });
    }

    createTab(response, index) {
        const tab = document.createElement('button');
        tab.className = 'tab-item';
        tab.dataset.index = index;
        
        const platform = document.createElement('span');
        platform.className = 'tab-platform';
        platform.textContent = response.platform;

        const time = document.createElement('span');
        time.className = 'tab-time';
        time.textContent = this.formatTime(response.timestamp);

        tab.appendChild(platform);
        tab.appendChild(time);

        tab.addEventListener('click', () => {
            this.selectTab(index);
        });

        return tab;
    }

    createTabContent(response, index) {
        const content = document.createElement('div');
        content.className = 'tab-panel';
        content.dataset.index = index;
        content.style.display = 'none';

        content.innerHTML = `
            <div class="response-header">
                <div class="response-meta">
                    <span class="platform-badge ${response.platform.toLowerCase()}">${response.platform}</span>
                    ${response.model ? `<span class="model-badge">${response.model}</span>` : ''}
                </div>
                <div class="response-time">${new Date(response.timestamp).toLocaleString()}</div>
            </div>
            <div class="response-content">${this.formatContent(response.content)}</div>
            <div class="response-footer">
                <a href="${response.url}" target="_blank" class="source-link">View Source</a>
                <button class="btn-copy" data-content="${this.escapeHtml(response.content)}">Copy</button>
            </div>
        `;

        content.querySelector('.btn-copy').addEventListener('click', (e) => {
            this.copyToClipboard(e.target.dataset.content);
        });

        return content;
    }

    createAccordionItem(response) {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        const header = document.createElement('button');
        header.className = 'accordion-header';
        header.innerHTML = `
            <div class="accordion-title">
                <span class="platform-badge ${response.platform.toLowerCase()}">${response.platform}</span>
                ${response.model ? `<span class="model-badge">${response.model}</span>` : ''}
            </div>
            <span class="accordion-time">${new Date(response.timestamp).toLocaleString()}</span>
            <span class="accordion-icon">▼</span>
        `;

        const content = document.createElement('div');
        content.className = 'accordion-content';
        content.innerHTML = `
            <div class="response-content">${this.formatContent(response.content)}</div>
            <div class="response-footer">
                <a href="${response.url}" target="_blank" class="source-link">View Source</a>
                <button class="btn-copy" data-content="${this.escapeHtml(response.content)}">Copy</button>
            </div>
        `;

        header.addEventListener('click', () => {
            item.classList.toggle('active');
            content.style.display = item.classList.contains('active') ? 'block' : 'none';
        });

        content.querySelector('.btn-copy').addEventListener('click', (e) => {
            this.copyToClipboard(e.target.dataset.content);
        });

        item.appendChild(header);
        item.appendChild(content);

        return item;
    }

    selectTab(index) {
        this.selectedTab = index;

        document.querySelectorAll('.tab-item').forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });

        document.querySelectorAll('.tab-panel').forEach((panel, i) => {
            panel.style.display = i === index ? 'block' : 'none';
        });
    }

    updateStatus(status) {
        const statusText = document.getElementById('statusText');
        statusText.textContent = status.message;
        statusText.className = `status-text status-${status.state}`;
    }

    showError(error) {
        const statusText = document.getElementById('statusText');
        statusText.textContent = error.message;
        statusText.className = 'status-text status-error';
        
        setTimeout(() => {
            statusText.className = 'status-text';
        }, 5000);
    }

    updateResponseCount(count) {
        document.getElementById('responseCount').textContent = `${count} response${count !== 1 ? 's' : ''}`;
    }

    showEmptyState() {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('tabViewContainer').style.display = 'none';
        document.getElementById('accordionViewContainer').style.display = 'none';
    }

    hideEmptyState() {
        document.getElementById('emptyState').style.display = 'none';
    }

    formatContent(content) {
        return content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.updateStatus({ state: 'success', message: 'Copied to clipboard!' });
        } catch (error) {
            this.showError({ message: 'Failed to copy to clipboard' });
        }
    }
}