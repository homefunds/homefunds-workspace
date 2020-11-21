import { Module } from '@nestjs/common';
import { SourceHandlersService } from './source-handlers.service';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';
import { registerHandlers } from './israeli-bank-scrapers/register-handlers';

@Module({
  controllers: [SourcesController],
  providers: [SourcesService, SourceHandlersService],
  exports: [],
})
export class SourcesModule {
  constructor(sourceHandlersService: SourceHandlersService) {
    registerHandlers(sourceHandlersService);
  }
}
