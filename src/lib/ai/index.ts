import { ProviderRegistry } from "./providers/registry";
import { BaseAIService } from "./base";
import "./providers/groq";
import "./providers/anthropic";
import "./providers/openai";
import "./providers/xai";

export * from "./providers/groq";
export * from "./providers/anthropic";
export * from "./providers/openai";
export * from "./providers/xai";
export * from "./models";

export class AIService {
  private static instance: AIService;
  private services: Map<string, BaseAIService<any>> = new Map();
  private registry: ProviderRegistry;

  private constructor() {
    this.registry = ProviderRegistry.getInstance();
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public getService<T extends string>(model: T): BaseAIService<T> {
    const provider = this.registry.getProviderByModel(model);
    
    if (!provider) {
      throw new Error(`No provider found for model: ${model}`);
    }

    let service = this.services.get(provider.name);
    
    if (!service) {
      service = new provider.serviceClass();
      this.services.set(provider.name, service);
    }

    return service as BaseAIService<T>;
  }
} 