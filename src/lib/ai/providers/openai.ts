import { BaseAIService } from "../base";
import { ProviderRegistry } from "./registry";

export enum OpenAIModel {
  O3 = "openai/o3",
  GEMINI_2_5 = "google/gemini-2.5-pro-exp-03-25",
  CLAUDE_3_7 = "anthropic/claude-3.7-sonnet:thinking",
  O4_MINI = "openai/o4-mini-high",
}

export class OpenAIService extends BaseAIService<OpenAIModel> {
  constructor() {
    const apiKeys = [
      process.env.HARVARD_OPENAI_API_KEY!,
    ].filter(Boolean);
    
    super(apiKeys, process.env.HARVARD_OPENAI_BASE_URL!);
  }

  protected getModelName(model: OpenAIModel): string {
    return model;
  }
  
  protected getDefaultModel(): string {
    return OpenAIModel.GEMINI_2_5;
  }
}

// Register the provider
ProviderRegistry.getInstance().registerProvider({
  name: "openai",
  serviceClass: OpenAIService,
  modelEnum: OpenAIModel
}); 