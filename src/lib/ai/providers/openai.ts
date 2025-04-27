import { BaseAIService } from "../base";
import { ProviderRegistry } from "./registry";

export enum OpenAIModel {
  O4_MINI = "openai/o4-mini",
  GEMINI_2_5 = "openai/o4-mini",}

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