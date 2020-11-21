import { Source, CountryLabels, SourceCategory } from '../types';

export const israelBankHapoalimId = 'israel-bank-hapoalim';

export const israelBankHapoalim: Source = {
	id: israelBankHapoalimId,
	name: 'Bank Hapoalim',
	nativeName: 'בנק הפועלים',
	thumbnail: '',
	country: CountryLabels.Israel,
	category: SourceCategory.Bank
}
