import { Injectable, Logger } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ChatGptService {
  private orgId: string;
  private apiKey: string;
  private openai;
  private logger = new Logger(ChatGptService.name);
  constructor(private readonly configService: ConfigService) {
    this.orgId = this.configService.get<string>('CHATGPT_ORG_ID');
    this.apiKey = this.configService.get<string>('CHATGPT_KEY');
    const configuration = new Configuration({
      organization: this.orgId,
      apiKey: this.apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  handleChat(content: string, user = 'user') {
    this.logger.log(`org id ${this.orgId} token ${this.apiKey}`);
    return this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: user, content }],
    });
  }
}
