import { Observable } from 'rxjs';

export interface Source {
	id: string;
	name: string,
	nativeName: string,
	thumbnail: string,
	country: string,
	category : SourceCategory
}

export enum SourceCategory {
	Bank = 'Bank',
	CreditCard = 'CreditCard'
}

export enum CountryLabels {
	Israel = 'Israel',
	Global = 'Global'
}

export type SourceHandlerOptions = {
  data: Record<string, any>,
  chromiumPath?: string,
  startDate: string;
}

export enum SourceHandlerTypes {
  Transactions = 'transactions',
  Checks = 'checks',
  Payments = 'payments'
}

export interface SourceAccount<TOriginHandlerType extends SourceHandlerTypes, TData> {
  id: string,
  originHandlerType: TOriginHandlerType,
  sourceId: string,
  accountName: string,
  data: TData,
}

export interface SourceHandler<THandlerType extends SourceHandlerTypes, TSourceAccount extends SourceAccount<THandlerType, any>> {
  id: string;
  type: THandlerType,
  sourceId: string;
  dataFields: string[];
  handler: (options: SourceHandlerOptions) => Observable<{ accounts: TSourceAccount }>;
}
