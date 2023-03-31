import { Module } from '@nestjs/common';
import { LineAppService } from './line-app.service';
import { LineAppController } from './line-app.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatgptModule } from 'src/chatgpt/chatgpt.module';
import { BullModule } from '@nestjs/bull';
import { LineAppProcessor } from './line-app.processor';
import { TaskService } from 'src/task.service';
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const token = config.get<string>('LINE_TOKEN');
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'chat',
    }),
    ChatgptModule,
  ],
  controllers: [LineAppController],
  providers: [LineAppService, LineAppProcessor, TaskService],
})
export class LineAppModule {}
