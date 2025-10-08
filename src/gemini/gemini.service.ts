import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';

@Injectable()
export class GeminiService {
  private model: ChatGoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.0-flash-exp',
      apiKey: apiKey,
      temperature: 0.3,
      maxOutputTokens: 8192,
    });
  }

  /**
   * Generate a response from Gemini using LangChain
   * @param prompt User prompt/question
   * @param systemPrompt Optional system instruction
   * @returns Generated response
   */
  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: BaseMessage[] = [];

    if (systemPrompt) {
      messages.push(new SystemMessage(systemPrompt));
    }

    messages.push(new HumanMessage(prompt));

    const response = await this.model.invoke(messages);
    return response.content.toString();
  }

  /**
   * Stream responses from Gemini
   * @param prompt User prompt/question
   * @param systemPrompt Optional system instruction
   * @returns Async generator for streaming
   */
  async *streamResponse(prompt: string, systemPrompt?: string) {
    const messages: BaseMessage[] = [];

    if (systemPrompt) {
      messages.push(new SystemMessage(systemPrompt));
    }

    messages.push(new HumanMessage(prompt));

    const stream = await this.model.stream(messages);

    for await (const chunk of stream) {
      yield chunk.content.toString();
    }
  }

  /**
   * Generate response with conversation history
   * @param messages Array of conversation messages
   * @returns Generated response
   */
  async chat(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>): Promise<string> {
    const langchainMessages = messages.map((msg) => {
      if (msg.role === 'system') {
        return new SystemMessage(msg.content);
      }
      return new HumanMessage(msg.content);
    });

    const response = await this.model.invoke(langchainMessages);
    return response.content.toString();
  }
}
