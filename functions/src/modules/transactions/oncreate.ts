import * as functions from 'firebase-functions';

import { AppConfig } from '../../core/app-config';

import { TransactionsService } from '../../core/services/transactions.service';
import { UsersService } from './../../core/services/users.service';

import { Transaction } from './../../core/interfaces/transaction';

const transactions = new TransactionsService();
const users = new UsersService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_TRANSACTIONS}/{docId}`)
	.onCreate(async (change, context) => {
		try {
			const id = context.params.docId;
			const { amount, out_balance, entry_balance, description } =
				change.data() as Transaction;
			const last_transaction = await transactions.getLast();
			const old_number =
				last_transaction?.code || AppConfig.TRANSACTION_COUNT_INIT;

			const newData: any = {
				code: old_number + 1,
				description: description || '...',
				users: [],
			};

			if (out_balance) {
				await users.withdrawBalance(out_balance, amount);
				newData.users = [out_balance];
			}

			if (entry_balance) {
				await users.rechargeBalance(entry_balance, amount);
				newData.users = [...newData.users, entry_balance];
			}

			await transactions.setOne(newData, id);
		} catch (error) {
			console.error(error);
		}
	});
