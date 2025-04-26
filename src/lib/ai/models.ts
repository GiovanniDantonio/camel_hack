import { OpenAIModel } from "./providers/openai";
import { XAIModel } from "./providers/xai";
import { GroqModel } from "./providers/groq";
import { AnthropicModel } from "./providers/anthropic";

// Create an object with all models
export const Models = {
  OpenAI: OpenAIModel,
  XAI: XAIModel,
  Groq: GroqModel,
  Anthropic: AnthropicModel,
  
  // Add a method to get the provider name for a model
  getProviderName: (model: AIModel): string => {
    // Check which provider's enum contains this model
    for (const [providerName, enumObj] of Object.entries(Models)) {
      if (providerName !== 'getProviderName' && Object.values(enumObj).includes(model as any)) {
        return providerName;
      }
    }
    return "Unknown";
  }
};

// Export a union type of all models for type safety
export type AIModel = OpenAIModel | XAIModel | GroqModel | AnthropicModel; 