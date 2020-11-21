import { Source, CountryLabels, SourceCategory } from '../types';

export const israelVisaCalId = 'israel-bank-visaCal';

export const israelVisaCal: Source = {
	id: israelVisaCalId,
	name: 'Visa Cal',
	nativeName: 'ויזה כ.א.ל',
	thumbnail: '',
	country: CountryLabels.Israel,
	category: SourceCategory.CreditCard
}
