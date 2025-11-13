import { BaseAIIntegration, AIIntegrationConfig } from './base-integration';

export class CopilotIntegration extends BaseAIIntegration {
  constructor() {
    const config: AIIntegrationConfig = {
      name: 'Copilot',
      baseUrl: 'https://copilot.microsoft.com/',
      supportsQueryParams: true,
      supportsPostMessage: false,
      queryParamKey: 'q'
    };
    super(config);
  }

  protected isValidOrigin(origin: string): boolean {
    return origin === 'https://copilot.microsoft.com' || origin === 'https://www.bing.com';
  }
}
