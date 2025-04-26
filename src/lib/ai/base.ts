import OpenAI from "openai";

// Technically retry is baked into the OpenAI SDK, just need to pass in the options
export interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
}

export abstract class BaseAIService<T extends string> {
  protected client: OpenAI;
  protected apiKeys: string[];
  protected currentKeyIndex: number = 0;
  protected baseURL: string;

  constructor(apiKeys: string[], baseURL: string) {
    if (!apiKeys.length) {
      throw new Error("No API keys provided");
    }
    this.apiKeys = apiKeys;
    this.baseURL = baseURL;
    this.client = this.createClient();
  }

  protected abstract getModelName(model: T): string;

  protected createClient(): OpenAI {
    return new OpenAI({
      apiKey: this.getNextApiKey(),
      baseURL: this.baseURL
    });
  }

  protected getNextApiKey(): string {
    const key = this.apiKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    return key;
  }

  protected async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async createCompletion(
    model: T | undefined,
    params: Omit<OpenAI.ChatCompletionCreateParams, "model">,
    retryOptions: Partial<RetryOptions> = {}
  ): Promise<any> {
    const options = {
      maxAttempts: 3,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      backoffFactor: 2,
      ...retryOptions
    };

    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < options.maxAttempts) {
      try {
        // If model is undefined, use a default model from the provider
        const modelName = model ? this.getModelName(model) : this.getDefaultModel();
        
        return await this.client.chat.completions.create({
          ...params,
          model: modelName
        });
      } catch (error: any) {
        lastError = error;
        
        if (error?.status !== 429) {
          throw error;
        }

        attempt++;
        
        if (attempt === options.maxAttempts) {
          throw lastError;
        }

        const delay = Math.min(
          options.initialDelayMs * Math.pow(options.backoffFactor, attempt - 1),
          options.maxDelayMs
        );

        // Create new client with next API key
        this.client = this.createClient();
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  // Get a default model to use when none is specified
  protected getDefaultModel(): string {
    // This should be overridden by each provider
    throw new Error("Default model not implemented");
  }
} 