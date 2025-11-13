import { BaseAIIntegration, AIIntegrationConfig } from './base-integration';

export class GeminiIntegration extends BaseAIIntegration {
  constructor() {
    const config: AIIntegrationConfig = {
      name: 'Gemini',
      baseUrl: 'https://gemini.google.com/',
      supportsQueryParams: true,
      supportsPostMessage: false,
      queryParamKey: 'q'
    };
    super(config);
  }

  protected isValidOrigin(origin: string): boolean {
    return origin === 'https://gemini.google.com';
  }
}
