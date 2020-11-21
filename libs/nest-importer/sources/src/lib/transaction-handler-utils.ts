import * as moment from 'moment';
import * as R from 'ramda';
import { SourceAccount, SourceHandler, SourceHandlerTypes } from './types';

export type TransactionSourceAccount = SourceAccount<SourceHandlerTypes.Transactions, Transaction[]>;


export interface TransactionSourceHandler extends SourceHandler<SourceHandlerTypes.Transactions, TransactionSourceAccount> {
}

export function isTransactionSourceAccount(account: SourceAccount<any, any>): account is TransactionSourceAccount {
  return account && account.originHandlerType !== SourceHandlerTypes.Transactions
}

export function isTransaction(value: any): value is Transaction {
  return R.where({
    date: R.allPass([R.is(String), (date: Date) => moment(date).isValid()]),
    processedDate: R.allPass([R.is(String), (date: Date) => moment(date).isValid()]),
    payee: R.either(R.isNil, R.is(String)),
    status: (value: string) => ['completed','pending'].includes(value),
    type: (value: string) => ['normal','installments'].includes(value),
    memo: R.either(R.isNil, R.is(String)),
    reference: R.either(R.isNil, R.is(String)),
    originalAmount:  R.is(Number),
    originalCurrency: R.is(String),
    chargedAmount: R.is(Number),
    chargedCurrency: R.either(R.isNil, R.is(String)),
    installments:R.either(R.isNil, R.both(R.propIs(Number, 'number'), R.propIs(Number, 'total')))
  })(value);
}

export type Transaction = {
  date: string,
  processedDate: string,
  payee: string,
  status: 'completed' | 'pending',
  memo?: string | null,
  reference?: string | null,
  originalAmount: number,
  originalCurrency: string,
  chargedAmount: number,
  type: string,
  chargedCurrency: string,
  installments: {
    number: number,
    total: number,
  } | null
}

const TRANSACTION_STATUS = {
  PENDING: 'pending',
};

export function filterTransactions(
  transactions: Transaction[],
  includeFutureTransactions: boolean,
  includePendingTransactions: boolean,
) {
  let result = transactions;

  if (!includeFutureTransactions) {
    const nowMoment = moment();
    result = result.filter((txn) => {
      const txnMoment = moment(txn.date);
      return txnMoment.isSameOrBefore(nowMoment, 'day');
    });
  }

  if (!includePendingTransactions) {
    result = result.filter(txn => txn.status !== TRANSACTION_STATUS.PENDING);
  }

  return result;
}

