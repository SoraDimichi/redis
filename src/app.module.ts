import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { ProductsQueriesController } from './app.queries.controller';
import { ProductsCommandsController } from './app.commands.controller';
import { ProductsService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { HttpClientProvider } from './http-client.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        stores: [
          createKeyv(
            `redis://${configService.get<string>('REDIS_HOST', 'localhost')}:${configService.get<number>('REDIS_PORT', 6379)}`,
          ),
        ],
      }),
    }),
  ],
  controllers: [ProductsQueriesController, ProductsCommandsController],
  providers: [ProductsService, HttpClientProvider],
})
export class AppModule {}
