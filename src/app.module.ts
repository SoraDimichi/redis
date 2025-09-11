import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ProductsQueriesController } from './app.queries.controller';
import { ProductsCommandsController } from './app.commands.controller';
import { ProductsProvider } from './app.provider';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>(
          'API_BASE_URL',
          'https://dummyjson.com',
        ),
        timeout: configService.get<number>('API_TIMEOUT', 5000),
      }),
    }),
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
  providers: [ProductsProvider],
})
export class AppModule {}
