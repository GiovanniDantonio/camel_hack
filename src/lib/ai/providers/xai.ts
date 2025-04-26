import { BaseAIService } from "../base";
import { ProviderRegistry } from "./registry";

export enum XAIModel {
  GROK_2_LATEST = "grok-2-latest"
}

export class XAIService extends BaseAIService<XAIModel> {
  constructor() {
    const apiKeys = [
      process.env.XAI_API_KEY!,
    ].filter(Boolean);
    
    super(apiKeys, "https://api.x.ai/v1");
  }

  protected getModelName(model: XAIModel): string {
    return model;
  }
  
  protected getDefaultModel(): string {
    return XAIModel.GROK_2_LATEST;
  }
}

// Register the provider
ProviderRegistry.getInstance().registerProvider({
  name: "xai",
  serviceClass: XAIService,
  modelEnum: XAIModel
}); 