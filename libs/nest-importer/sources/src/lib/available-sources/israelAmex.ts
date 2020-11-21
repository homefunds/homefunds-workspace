import { Source, CountryLabels, SourceCategory } from '../types';

export const israelAmexId = 'israel-bank-amex';

export const israelAmex: Source = {
	id: israelAmexId,
	name: 'American Express',
	nativeName: 'אמריקן אקספרס',
	thumbnail: '',
	country: CountryLabels.Israel,
	category: SourceCategory.CreditCard
}
