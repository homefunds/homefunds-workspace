import { Source, CountryLabels, SourceCategory } from '../types';

export const israelBankDiscountId = 'israel-bank-discount';

export const israelBankDiscount: Source = {
	id: israelBankDiscountId,
	name: 'Bank Discount',
	nativeName: 'בנק דיסקונט',
	thumbnail: '',
	country: CountryLabels.Israel,
	category: SourceCategory.Bank
}

