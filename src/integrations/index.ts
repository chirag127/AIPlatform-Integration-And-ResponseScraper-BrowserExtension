export { BaseAIIntegration } from './base-integration';
export type { AIIntegrationConfig, MessagePayload } from './base-integration';
export { ChatGPTIntegration } from './chatgpt';
export { ClaudeIntegration } from './claude';
export { GeminiIntegration } from './gemini';
export { PerplexityIntegration } from './perplexity';
export { GrokIntegration } from './grok';
export { CopilotIntegration } from './copilot';
export { MetaAIIntegration } from './meta-ai';

import { ChatGPTIntegration } from './chatgpt';
import { ClaudeIntegration } from './claude';
import { GeminiIntegration } from './gemini';
import { PerplexityIntegration } from './perplexity';
import { GrokIntegration } from './grok';
import { CopilotIntegration } from './copilot';
import { MetaAIIntegration } from './meta-ai';

export const AIIntegrations = {
  ChatGPT: ChatGPTIntegration,
  Claude: ClaudeIntegration,
  Gemini: GeminiIntegration,
  Perplexity: PerplexityIntegration,
  Grok: GrokIntegration,
  Copilot: CopilotIntegration,
  MetaAI: MetaAIIntegration
};
