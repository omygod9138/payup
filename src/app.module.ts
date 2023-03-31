import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { LineAppModule } from './line-app/line-app.module';
import { ChatgptModule } from './chatgpt/chatgpt.module';
// import { SlackModule } from 'nestjs-slack-bolt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST'),
          port: +config.get<number>('REDIS_PORT'),
          username: config.get<string>('REDIS_USER'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'chat',
    }),
    LineAppModule,
    ChatgptModule,
    // SlackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
