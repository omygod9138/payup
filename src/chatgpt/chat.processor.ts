import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ChatGptService } from './chatgpt.service';
@Processor('chat')
export class ChatProcessor {
  private readonly logger = new Logger(ChatProcessor.name);
  constructor(
    @InjectQueue('line-app')
    private lineAppQueue: Queue,
    private chatgptService: ChatGptService,
  ) {}

  @Process('chat-completion')
  async handleChat(job: Job): Promise<void> {
    try {
      this.logger.log('creating chat completion...', job.data);
      const response = await this.chatgptService.handleChat(job.data.content);
      const choices = response.data.choices;
      const completedChat = choices[0].message.content;
      this.logger.log('chat completed...', completedChat);
      const messages = [
        {
          type: 'text',
          text: completedChat,
        },
      ];
      const to = job.data.to;
      this.logger.log(`replying to ${to}`);
      await this.lineAppQueue.add(
        'send-msg',
        {
          to,
          messages,
        },
        {
          attempts: 3,
          removeOnFail: true,
          removeOnComplete: true,
        },
      );
      this.logger.log(`message added to send-msg queue to ${job.data.to}`);
    } catch (e) {
      this.logger.error('Bad Chat process', e.message);
    }
  }
}
