import { Module } from '@nestjs/common';
import { ChatProcessor } from './chat.processor';
import { ChatGptService } from './chatgpt.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'line-app',
    }),
  ],
  providers: [ChatProcessor, ChatGptService],
  exports: [ChatGptService],
})
export class ChatgptModule {}
