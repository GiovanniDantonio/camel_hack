import { BaseAIService } from "../base";
import { ProviderRegistry } from "./registry";

export enum OpenAIModel {
  GPT_4o = "gpt-4o",
  GPT_4o_MINI = "gpt-4o-mini",
  O1 = "o1",
  O3_MINI = "o3-mini"
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