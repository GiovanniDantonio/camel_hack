import { BaseAIService } from "../base";

export interface ProviderConfig {
  name: string;
  serviceClass: new () => BaseAIService<any>;
  modelEnum: Record<string, string>;
} 