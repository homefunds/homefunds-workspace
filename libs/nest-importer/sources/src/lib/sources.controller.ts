import { Controller, Get } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourceHandlersService } from './source-handlers.service';

@Controller('sources')
export class SourcesController {
  constructor(private sourcesService: SourcesService, private sourceHandlersService: SourceHandlersService) {}

  @Get()
  findAll() {
    return this.sourcesService.getAllSources().map(source => {
      const sourceHandlers = this.sourceHandlersService.getSourceHandlers(source.id);
      return {
        ...source,
        handlers: sourceHandlers.map(sourceHandler => ({
          id: sourceHandler.id,
          type: sourceHandler.type,
          dataFields: sourceHandler.dataFields
        }))
      }
    });
  }
}
