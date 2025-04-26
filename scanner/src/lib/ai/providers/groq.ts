import { BaseAIService } from "../base";
import { ProviderRegistry } from "./registry";

export enum GroqModel {
  DEEPSEEK_R1_DISTILL_LLAMA_70B = "deepseek-r1-distill-llama-70b",
  LLAMA_3_3_70B_VERSATILE = "llama-3.3-70b-versatile"
}

export class GroqService extends BaseAIService<GroqModel> {
  constructor() {
    const apiKeys = [
      process.env.GROQ_API_KEY_1!,
      process.env.GROQ_API_KEY_2!
    ].filter(Boolean);
    
    super(apiKeys, "https://api.groq.com/v1");
  }

  protected getModelName(model: GroqModel): string {
    return model;
  }
  
  protected getDefaultModel(): string {
    return GroqModel.DEEPSEEK_R1_DISTILL_LLAMA_70B;
  }
}

// Register the provider
ProviderRegistry.getInstance().registerProvider({
  name: "groq",
  serviceClass: GroqService,
  modelEnum: GroqModel
}); 