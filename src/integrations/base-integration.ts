export interface AIIntegrationConfig {
  name: string;
  baseUrl: string;
  supportsQueryParams: boolean;
  supportsPostMessage: boolean;
  queryParamKey?: string;
}

export interface MessagePayload {
  type: string;
  content?: string;
  data?: any;
}

export abstract class BaseAIIntegration {
  protected iframe: HTMLIFrameElement | null = null;
  protected config: AIIntegrationConfig;
  protected messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(config: AIIntegrationConfig) {
    this.config = config;
  }

  createIframe(container: HTMLElement, prompt?: string): HTMLIFrameElement {
    this.iframe = document.createElement('iframe');
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = 'none';
    
    const url = this.buildUrl(prompt);
    this.iframe.src = url;
    
    if (this.config.supportsPostMessage) {
      this.setupPostMessageListener();
    }
    
    container.appendChild(this.iframe);
    return this.iframe;
  }

  protected buildUrl(prompt?: string): string {
    let url = this.config.baseUrl;
    
    if (prompt && this.config.supportsQueryParams && this.config.queryParamKey) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}${this.config.queryParamKey}=${encodeURIComponent(prompt)}`;
    }
    
    return url;
  }

  protected setupPostMessageListener(): void {
    window.addEventListener('message', (event) => {
      if (this.isValidOrigin(event.origin)) {
        this.handleMessage(event.data);
      }
    });
  }

  protected abstract isValidOrigin(origin: string): boolean;

  protected handleMessage(data: MessagePayload): void {
    const handler = this.messageHandlers.get(data.type);
    if (handler) {
      handler(data.data);
    }
  }

  sendMessage(message: MessagePayload): void {
    if (this.iframe && this.config.supportsPostMessage) {
      this.iframe.contentWindow?.postMessage(message, this.config.baseUrl);
    }
  }

  onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  destroy(): void {
    if (this.iframe && this.iframe.parentElement) {
      this.iframe.parentElement.removeChild(this.iframe);
    }
    this.iframe = null;
    this.messageHandlers.clear();
  }

  updatePrompt(prompt: string): void {
    if (this.config.supportsQueryParams && this.iframe) {
      const url = this.buildUrl(prompt);
      this.iframe.src = url;
    } else if (this.config.supportsPostMessage) {
      this.sendMessage({ type: 'prompt', content: prompt });
    }
  }
}
