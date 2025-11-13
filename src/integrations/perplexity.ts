import { BaseAIIntegration, AIIntegrationConfig } from './base-integration';

export class PerplexityIntegration extends BaseAIIntegration {
  constructor() {
    const config: AIIntegrationConfig = {
      name: 'Perplexity',
      baseUrl: 'https://www.perplexity.ai/',
      supportsQueryParams: true,
      supportsPostMessage: false,
      queryParamKey: 'q'
    };
    super(config);
  }

  protected isValidOrigin(origin: string): boolean {
    return origin === 'https://www.perplexity.ai';
  }
}
