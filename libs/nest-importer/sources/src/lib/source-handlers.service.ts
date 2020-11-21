import { Injectable } from '@nestjs/common';
import { Source, SourceHandler } from './types';

@Injectable()
export class SourceHandlersService {
  #sourceHandlers: SourceHandler<any, any>[] = [];

  addSourceHandler(handler: SourceHandler<any, any>): void {
    // TODO validate
    //log.info(`register source handler for '${handler.sourceId}', feature '${handler.handlerType}', id ${handler.id}`);
    this.#sourceHandlers = [...this.#sourceHandlers, handler];
  }

  getSourceHandlers(sourceId: string): SourceHandler<any, any>[] {
    return this.#sourceHandlers
      .filter(sourceHandler => sourceHandler.sourceId === sourceId)
      .map(item => ({
      ...item
    }));
  }

  getSourceHandler(handlerId: string): SourceHandler<any, any> {
    const sourceHandler = this.#sourceHandlers.find(item => item.id === handlerId);

    if (!sourceHandler) {
      throw new Error(`unknown source requested with id ${handlerId}`);
    }

    return sourceHandler;
  }
}

