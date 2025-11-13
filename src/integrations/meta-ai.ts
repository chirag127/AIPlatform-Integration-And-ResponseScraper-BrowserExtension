import { BaseAIIntegration, AIIntegrationConfig } from './base-integration';

export class MetaAIIntegration extends BaseAIIntegration {
  constructor() {
    const config: AIIntegrationConfig = {
      name: 'Meta AI',
      baseUrl: 'https://www.meta.ai/',
      supportsQueryParams: true,
      supportsPostMessage: false,
      queryParamKey: 'prompt'
    };
    super(config);
  }

  protected isValidOrigin(origin: string): boolean {
    return origin === 'https://www.meta.ai';
  }
}
