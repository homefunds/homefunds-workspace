import { of, Observable, defer} from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import * as R from 'ramda';
import { SCRAPERS, createScraper, CompanyTypes } from 'israeli-bank-scrapers-core';
import * as moment from 'moment';
import { SourceHandlerOptions,
  SourceHandlerTypes } from '../../types'
import {
  Transaction,
} from '../../transaction-handler-utils';

type TransactionHandlerResult = {type: SourceHandlerTypes.Transactions, accounts: any[]}

function validateSource(scraperId: string, handlerOptions: SourceHandlerOptions) : Error | null {
	const { loginFields } = SCRAPERS[scraperId];
	const sourceFields = Object.keys(handlerOptions.data);

	const missingFields = loginFields.filter((field: string) => !sourceFields.includes(field));
	return missingFields.length ?
		 new Error('invalid settings')
			: null;
}
function getTransactionStatus(status: string) {
	if (status === 'pending') {
		return 'pending';
	}

	return 'completed';
}

function getTransactionType(type: string) {
	if (type === 'installments') {
		return 'installments';
	}

	return 'normal';
}

const transactionProperties = ['date','processedDate', 'status','memo','originalAmount','originalCurrency','chargedAmount','chargedCurrency','installments'];

function parseTransactions(scrapedTransactions: any[]):  Transaction[] {
	return scrapedTransactions.map(scrapedTransaction => {
		return {
			...R.pick(transactionProperties, scrapedTransaction),
			payee: scrapedTransaction.description,
			reference: scrapedTransaction.identifier ? String(scrapedTransaction.identifier) : null,
			status: getTransactionStatus(scrapedTransaction.status),
			type: getTransactionType(scrapedTransaction.type)
		} as Transaction
	})
}

function parseScraperResult(options: SourceHandlerOptions, sourceId: string, scraperResult: any): TransactionHandlerResult {
	console.log(`success: ${scraperResult.success}`);

	if (!scraperResult.success) {
		console.log(`error type: ${scraperResult.errorType}`);
		console.log('error:', scraperResult.errorMessage);

		throw new Error(scraperResult.errorMessage || scraperResult.errorType);
	}

	const parseResult = scraperResult.accounts.map((scrapedAccount: any) => ({
		name: scrapedAccount.accountNumber,
		transactions: parseTransactions(scrapedAccount.txns)
	})).reduce((acc: any, account: any) => {

		if (!account.name) {
			return {
				...acc,
				errors: [...acc.errors, new Error('failed to extract account name')]
			}
		}

		if (account.transactions.error) {
			return {
				...acc,
				errors: [...acc.errors, account.transactions.error]
			}
		}

		const accountId = `${sourceId}_${account.name}`;
		return {
			...acc,
			accounts: [
				...acc.accounts,
				{
					id: accountId,
					sourceId,
					accountName: account.name,
					transactions: account.transactions
				}
			]
		}
	}, {errors: [], accounts: []} as { errors: Error[], accounts: TransactionHandlerResult['accounts'] });

	if (parseResult.errors.length) {
		console.table(parseResult.errors.map(({message}: { message: any }) => message));
		throw new Error('failed to parse scraped accounts');
	}

	return {type: SourceHandlerTypes.Transactions, accounts: parseResult.accounts};
}

let chromiumExecutablePath = '';
export function setChromiumExecutablePath(path: string): void {
	chromiumExecutablePath = path;
}
export default  (scraperId: string, sourceId: string, handlerOptions: SourceHandlerOptions): Observable<TransactionHandlerResult> => {
	return of(handlerOptions)
		.pipe(
			tap((options: any) => {
				const error = validateSource(scraperId, options);
				if (error) {
					throw error
				}
			}),
			map((options: any) => {
			  const companyId = CompanyTypes[scraperId];

			  if (!companyId) {
			    throw new Error(`unknown company requested '${scraperId}'`);
        }

				const startMoment = moment(options.startDate);
				const scraperOptions = {
					companyId: companyId,
					startDate: startMoment.toDate(),
					combineInstallments: false,
					showBrowser: true,
					executablePath: handlerOptions.chromiumPath
				};

				const scraper = createScraper(scraperOptions);

				if (!scraper) {
					throw new Error("invalid options");
				}

				scraper.onProgress((sourceId: string, payload: any) => {
					// TODO write to actual logs
					console.log(`${sourceId}: ${payload.type}`);
				});

				return scraper;
			}),
			switchMap((scraper: any) => {
				return defer(async () =>  await scraper.scrape(handlerOptions.data));
			}),
			map((result: any) => {
				return parseScraperResult(handlerOptions, sourceId, result);
			})
		)
}
