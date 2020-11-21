import { Injectable } from '@nestjs/common';
import { Source, SourceHandler } from './types';
import {
  israelAmex,
  israelBankDiscount,
  israelBankHapoalim, israelBankLeumi,
  israelBankOtsarHahayal,
  israelIsracard, israelLeumiCard,
  israelVisaCal
} from './available-sources';

@Injectable()
export class SourcesService {
  #sources: Source[] = [
    israelAmex,
    israelBankLeumi,
    israelLeumiCard,
    israelBankDiscount,
    israelBankHapoalim,
    israelBankOtsarHahayal,
    israelIsracard,
    israelVisaCal
  ];

  getSource(sourceId: string): Source {
    return this.#sources.find(source => source.id === sourceId);
  }

  getAllSources(): Source[] {
    return [...this.#sources];
  }
}

