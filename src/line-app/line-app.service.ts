import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Client } from '@line/bot-sdk';

@Injectable()
export class LineAppService {
  private channelSecret: string;
  private client: Client;
  private readonly logger = new Logger(LineAppService.name);
  private response = [
    '別急，讓子彈飛一會兒。',
    '去去就来',
    '马上来',
    '随我来',
    '你等我',
  ];
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
    @InjectQueue('chat')
    private chatQueue: Queue,
  ) {
    const channelAccessToken =
      this.configService.get<string>('LINE_ACCESS_TOKEN');
    this.channelSecret = this.configService.get<string>('LINE_CHANNEL_SECRET');
    this.client = new Client({
      channelAccessToken,
      channelSecret: this.channelSecret,
    });
  }

  async getGroupUserById(groupId, userId) {
    const endpoint = `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`;
    const result = await firstValueFrom(this.http.get(endpoint));
    return result.data;
  }

  async handleWebhook(payload, verificationHeader) {
    const events = payload.events;
    const event = events[0];
    this.logger.log('event ', event);
    const userId = event.source.userId;
    const groupId = event.source.groupId;
    this.logger.log(`userId ${userId}, groupId ${groupId}`);
    if (!userId && !groupId) return;
    if (event.message.type !== 'text') return;
    const replyToken = event.replyToken;

    const requestMessage = event.message.text;
    try {
      const body = JSON.stringify(payload);

      const signature = crypto
        .createHmac('SHA256', this.channelSecret)
        .update(body)
        .digest('base64');

      if (verificationHeader === signature) {
        if (
          requestMessage.includes('師爺') &&
          requestMessage.replace('師爺', '').trim().length > 0
        ) {
          const id = groupId == 'undefined' ? userId : groupId;

          await this.queueForChat(requestMessage, id);
          const responseIndex = Math.floor(
            Math.random() * this.response.length,
          );
          this.logger.log(`responseIndex ${responseIndex}`);
          const replyMessage = {
            type: 'text',
            text: this.response[responseIndex],
          };

          this.logger.log(`request message ${requestMessage} to ${id}`);
          this.replyMessage(replyMessage, replyToken);
        }
      } else {
        return;
      }
    } catch (e) {
      this.logger.log(`handle webhook error ${e.message} ${replyToken}`);
    }
  }

  async sendMessage(to, messages) {
    try {
      await this.client.pushMessage(to, messages);
      this.logger.log(`message sent ${to}`);
    } catch (e) {
      this.logger.log(`push message error ${e.message}`);
    }
  }

  async replyMessage(replyMessage, replyToken) {
    try {
      await this.client.replyMessage(replyToken, replyMessage);
      this.logger.log(`message replied ${replyMessage.text}`);
    } catch (e) {
      this.logger.log(`Bad reply ${e.message}`);
    }
  }

  queueForChat(requestMessage, id) {
    return this.chatQueue.add(
      'chat-completion',
      {
        to: id,
        content: requestMessage.replace('師爺', ''),
      },
      {
        attempts: 3,
        removeOnFail: true,
        removeOnComplete: true,
      },
    );
  }
}
