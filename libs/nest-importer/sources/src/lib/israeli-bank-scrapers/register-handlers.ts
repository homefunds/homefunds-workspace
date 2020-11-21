import { SourceHandler } from '../types';
import { register as registerTransactions } from './transactions/register';
import { SourceHandlersService } from '../source-handlers.service';

export function registerHandlers(sourceHandlersService: SourceHandlersService) {
  const sourcesHandlers: SourceHandler<any, any>[] = [
    ...registerTransactions()
  ];

  sourcesHandlers.forEach(sourcesHandler => {
    sourceHandlersService.addSourceHandler(sourcesHandler);
  })
}
