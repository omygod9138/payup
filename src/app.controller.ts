import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { Action, Command, Message, Event } from 'nestjs-slack-bolt';
// import {
//   SlackActionMiddlewareArgs,
//   SlackCommandMiddlewareArgs,
//   SlackEventMiddlewareArgs,
// } from '@slack/bolt';
// import { ChatGptService } from './chatgpt/chatgpt.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // private chatgptService: ChatGptService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  // @Message('師爺') //Handle a message event
  // async message({ message, say }) {
  //   console.log(message);
  //   const text = message.text;
  //   if (text.replace('師爺').trim().length <= 0) {
  //     say('在');
  //   } else {
  //     const response = await this.chatgptService.handleChat(
  //       text.replace('師爺').trim(),
  //     );
  //     const choices = response.data.choices;
  //     const completedChat = choices[0].message.content;
  //     say(completedChat);
  //   }
  // }

  // @Action('click') //Handle an action
  // action({ say }: SlackActionMiddlewareArgs) {
  //   say('click event received');
  // }

  // @Command('/list') // handle command
  // command({ say }: SlackCommandMiddlewareArgs) {
  //   say('/list command received');
  // }

  // @Event('app_home_opened')
  // event({ say }: SlackEventMiddlewareArgs) {
  //   say('app_open_event received');
  // }
}
