import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { LineAppService } from './line-app.service';

@Processor('line-app')
export class LineAppProcessor {
  private readonly logger = new Logger(LineAppProcessor.name);
  constructor(private readonly lineAppService: LineAppService) {}

  @Process('send-msg')
  async handleSendMsg(job: Job): Promise<void> {
    this.logger.log('send msg job received', job.data.to);
    const to = job.data.to;
    const messages = job.data.messages;
    await this.lineAppService.sendMessage(to, messages);
  }
}
