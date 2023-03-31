import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { LineAppService } from './line-app.service';

@Controller('line-app')
export class LineAppController {
  constructor(private readonly lineAppService: LineAppService) {}

  @Get()
  findAll() {
    return this.lineAppService.queueForChat(
      '師爺 說個笑話',
      'U2161660bf3a2099827e2ba0152cad292',
    );
  }

  @Post('/line-webhook')
  async handleWebhook(@Headers() headers, @Body() payload) {
    const verificationHeader = headers['x-line-signature'];
    return this.lineAppService.handleWebhook(payload, verificationHeader);
  }
}
