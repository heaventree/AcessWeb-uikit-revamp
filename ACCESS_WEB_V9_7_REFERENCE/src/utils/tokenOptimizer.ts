import { DiffManager } from './diffManager';

interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
}

export class TokenOptimizer {
  private static instance: TokenOptimizer;
  private diffManager: DiffManager;
  private usage: TokenUsage = { prompt: 0, completion: 0, total: 0 };
  private readonly maxTokensPerRequest = 4000;

  private constructor() {
    this.diffManager = DiffManager.getInstance();
  }

  static getInstance(): TokenOptimizer {
    if (!TokenOptimizer.instance) {
      TokenOptimizer.instance = new TokenOptimizer();
    }
    return TokenOptimizer.instance;
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  private truncateContent(content: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokens(content);
    if (estimatedTokens <= maxTokens) return content;

    // Truncate to approximate target length
    const targetLength = maxTokens * 4;
    return content.slice(0, targetLength) + '...';
  }

  async optimizePrompt(prompt: string): Promise<string> {
    // Ensure prompt fits within token limits
    const optimizedPrompt = this.truncateContent(prompt, this.maxTokensPerRequest);
    
    // Update usage metrics
    this.usage.prompt += this.estimateTokens(optimizedPrompt);
    this.usage.total = this.usage.prompt + this.usage.completion;
    
    return optimizedPrompt;
  }

  async optimizeCompletion(completion: string): Promise<string> {
    // Check if we have a cached diff
    const diff = this.diffManager.getDiff('completion', completion);
    if (!diff) return ''; // Use cached version

    // Optimize new content
    const optimizedCompletion = this.truncateContent(diff, this.maxTokensPerRequest);
    
    // Update usage metrics
    this.usage.completion += this.estimateTokens(optimizedCompletion);
    this.usage.total = this.usage.prompt + this.usage.completion;
    
    return optimizedCompletion;
  }

  getUsage(): TokenUsage {
    return { ...this.usage };
  }

  resetUsage(): void {
    this.usage = { prompt: 0, completion: 0, total: 0 };
  }
}
