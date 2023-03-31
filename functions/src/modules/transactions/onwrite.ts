import { GenerateThumbnail } from './../../core/utils/generate-thumbnail';
import { StringToArray } from './../../core/utils/string-to-array';

import * as functions from 'firebase-functions';

import { Transaction } from './../../core/interfaces/transaction';
import { AppConfig } from '../../core/app-config';
import { TransactionsService } from '../../core/services/transactions.service';

const transactions = new TransactionsService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_TRANSACTIONS}/{docId}`)
	.onWrite(async (change, context) => {
		const id: string = context.params.docId;
		try {
			if (!change.after.exists) return;
			const old_data = change?.before?.data() as Transaction;
			const data = change.after.data() as Transaction;
			let new_data = { search: [] } as any;
			let changed = false;

			const search = GetSearchArray(data);
			if (search.join('') !== old_data?.search?.join('')) {
				changed = true;
				new_data['search'] = search;
			}
			if (old_data?.image?.url !== data?.image?.url && !!data.image) {
				changed = true;
				new_data['image'] = await GenerateThumbnail(data.image);
			}

			if (!changed) return;

			await transactions.setOne(new_data, id);
		} catch (error) {
			return console.error(error);
		}
	});

const GetSearchArray = (data: Transaction): string[] => {
	const code_array = StringToArray(data?.code);
	const amount_array = StringToArray(data?.amount?.value);
	const type_array = StringToArray(data?.type);
	return [...amount_array, ...type_array, ...code_array];
};
