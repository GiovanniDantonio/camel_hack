import { BaseAIService } from "../base";
import { ProviderRegistry } from "./registry";

export enum OpenAIModel {
  GPT_4o = "gpt-4o",
  GPT_4o_MINI = "gpt-4o-mini",
  O1 = "o1",
  O3_MINI = "o3-mini",
  O3 = "o3",
  GEMINI_2_5 = "gemini-2.5-pro",
  CLAUDE_3_7 = "claude-3-7-sonnet",
  O4_MINI = "o4-mini",
  GPT_4_TURBO = "gpt-4-turbo",
  GPT_4_TURBO_128K = "gpt-4-turbo-128k",
  GPT_4_VISION = "gpt-4-vision-preview",
  GPT_3_5_TURBO = "gpt-3.5-turbo",
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
    return OpenAIModel.GPT_4o;
  }
}

// Register the provider
ProviderRegistry.getInstance().registerProvider({
  name: "openai",
  serviceClass: OpenAIService,
  modelEnum: OpenAIModel
}); 