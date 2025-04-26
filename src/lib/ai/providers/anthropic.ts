import { BaseAIService } from "../base";
import { ProviderRegistry } from "./registry";

export enum AnthropicModel {
  CLAUDE_3_5_SONNET = "claude-3-5-sonnet-latest",
  CLAUDE_3_7_SONNET = "claude-3-7-sonnet-latest"
}

export class AnthropicService extends BaseAIService<AnthropicModel> {
  constructor() {
    const apiKeys = [
      process.env.ANTHROPIC_API_KEY_1!,
      process.env.ANTHROPIC_API_KEY_2!
    ].filter(Boolean);
    
    super(apiKeys, "https://api.anthropic.com/v1");
  }

  protected getModelName(model: AnthropicModel): string {
    return model;
  }
  
  protected getDefaultModel(): string {
    return AnthropicModel.CLAUDE_3_5_SONNET;
  }
}

// Register the provider
ProviderRegistry.getInstance().registerProvider({
  name: "anthropic",
  serviceClass: AnthropicService,
  modelEnum: AnthropicModel
}); 