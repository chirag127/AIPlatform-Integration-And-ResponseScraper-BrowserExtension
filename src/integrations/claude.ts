import { BaseAIIntegration, AIIntegrationConfig } from './base-integration';

export class ClaudeIntegration extends BaseAIIntegration {
  constructor() {
    const config: AIIntegrationConfig = {
      name: 'Claude',
      baseUrl: 'https://claude.ai/',
      supportsQueryParams: false,
      supportsPostMessage: true,
      queryParamKey: undefined
    };
    super(config);
  }

  protected isValidOrigin(origin: string): boolean {
    return origin === 'https://claude.ai';
  }
}
