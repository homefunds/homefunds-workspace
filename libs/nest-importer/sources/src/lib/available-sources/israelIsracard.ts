import { Source, CountryLabels, SourceCategory } from '../types';

export const israelIsracardId = 'israel-bank-isracard';

export const israelIsracard: Source = {
	id: israelIsracardId,
	name: 'Isracard',
	nativeName: 'ישראכרט',
	thumbnail: '',
	country: CountryLabels.Israel,
	category: SourceCategory.CreditCard
}
