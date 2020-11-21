import { Source, CountryLabels, SourceCategory } from '../types';

export const israeliBankLeumiId = 'israel-bank-leumi';

export const israelBankLeumi: Source = {
	id: israeliBankLeumiId,
	name: 'Bank Leumi',
	nativeName: 'בנק לאומי',
	thumbnail: '',
	country: CountryLabels.Israel,
	category: SourceCategory.Bank
}
