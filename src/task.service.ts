import { LineAppService } from './line-app/line-app.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskService {
  constructor(
    private readonly messageService: LineAppService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 4 26 3 *')
  handleCron() {
    const to = this.configService.get<string>('GROUP_ID');
    const messages = [
      {
        type: 'text',
        text: '各位大大該繳費囉，費用準時繳，Netflix看到老。',
      },
    ];
    return this.messageService.sendMessage(to, messages);
  }
}
