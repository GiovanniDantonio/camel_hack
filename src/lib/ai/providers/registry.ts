import { ProviderConfig } from "./types";

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: Map<string, ProviderConfig> = new Map();

  private constructor() {}

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  public registerProvider(config: ProviderConfig): void {
    this.providers.set(config.name, config);
  }

  public getProvider(name: string): ProviderConfig | undefined {
    return this.providers.get(name);
  }

  public getProviderByModel(model: string): ProviderConfig | undefined {
    return Array.from(this.providers.values()).find(provider => 
      Object.values(provider.modelEnum).includes(model)
    );
  }
} 