import { Source, CountryLabels, SourceCategory } from '../types';

export const israelLeumiCardId = 'israel-leumi-card';

export const israelLeumiCard: Source = {
	id: israelLeumiCardId,
	name: 'Leumi Card',
	nativeName: 'לאומי קארד',
	thumbnail: '',
	country: CountryLabels.Israel,
	category: SourceCategory.CreditCard
}
