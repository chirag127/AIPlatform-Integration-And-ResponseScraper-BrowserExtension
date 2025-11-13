import { BaseAIIntegration, AIIntegrationConfig } from './base-integration';

export class GrokIntegration extends BaseAIIntegration {
  constructor() {
    const config: AIIntegrationConfig = {
      name: 'Grok',
      baseUrl: 'https://x.com/i/grok',
      supportsQueryParams: false,
      supportsPostMessage: true,
      queryParamKey: undefined
    };
    super(config);
  }

  protected isValidOrigin(origin: string): boolean {
    return origin === 'https://x.com' || origin === 'https://twitter.com';
  }
}
