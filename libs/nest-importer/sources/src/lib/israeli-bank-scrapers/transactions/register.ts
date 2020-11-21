import handler from './handler';
import {
  SourceHandler,
  SourceHandlerOptions,
  SourceHandlerTypes,
} from '../../types';
import { TransactionSourceAccount } from '../../transaction-handler-utils';
import { handlerId } from '../definitions';
import {
  israelAmexId,
  israelBankDiscountId,
  israelBankHapoalimId, israelBankOtsarHahayalId,
  israeliBankLeumiId, israelIsracardId, israelLeumiCardId, israelVisaCalId
} from '../../available-sources';
import {SCRAPERS} from 'israeli-bank-scrapers-core';

function createHandler(sourceId, type: string): SourceHandler<SourceHandlerTypes.Transactions, TransactionSourceAccount> {
	return {
		id: `${handlerId}_${type}_transactions`,
		sourceId: sourceId,
		type: SourceHandlerTypes.Transactions,
		dataFields: SCRAPERS[type].loginFields,
		handler: (options: SourceHandlerOptions) => {
			return handler(type, sourceId, options);
		}
	};
}

export function register() {
	const result: SourceHandler<SourceHandlerTypes.Transactions, any>[] = [
		createHandler(israeliBankLeumiId, 'leumi'),
		createHandler(israelBankHapoalimId, 'hapoalim'),
		createHandler(israelBankDiscountId, 'discount'),
		createHandler(israelBankOtsarHahayalId, 'otsarHahayal'),
		createHandler(israelLeumiCardId, 'leumiCard'),
		createHandler(israelVisaCalId, 'visaCal'),
		createHandler(israelIsracardId, 'isracard'),
		createHandler(israelAmexId, 'amex')
	];

	return result;
}
