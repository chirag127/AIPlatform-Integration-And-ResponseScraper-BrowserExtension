import { BaseAIIntegration, AIIntegrationConfig } from './base-integration';

export class ChatGPTIntegration extends BaseAIIntegration {
  constructor() {
    const config: AIIntegrationConfig = {
      name: 'ChatGPT',
      baseUrl: 'https://chat.openai.com/',
      supportsQueryParams: true,
      supportsPostMessage: false,
      queryParamKey: 'q'
    };
    super(config);
  }

  protected isValidOrigin(origin: string): boolean {
    return origin === 'https://chat.openai.com' || origin === 'https://chatgpt.com';
  }
}
