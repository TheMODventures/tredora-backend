import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { RequirementUnderstandingAgent } from './agents/requirement-understanding.agent';
import { ChatAssistantAgent } from './agents/chat-assistant.agent';

@Module({
  imports: [ConfigModule],
  controllers: [GeminiController],
  providers: [GeminiService, RequirementUnderstandingAgent, ChatAssistantAgent],
  exports: [GeminiService, RequirementUnderstandingAgent, ChatAssistantAgent],
})
export class GeminiModule {}
