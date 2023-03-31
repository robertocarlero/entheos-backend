import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { AppConfig } from '../../core/app-config';
import { Colors } from '../../core/enums/colors';
import { Sale } from '../../core/interfaces/sale';

import { ProductsService } from '../../core/services/products.service';
import { SalesService } from '../../core/services/sales.service';
import { TransactionsService } from '../../core/services/transactions.service';
import { TransactionsTypes } from '../../core/enums/transaction-types';

const sales = new SalesService();
const products = new ProductsService();
const transactions = new TransactionsService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_SALES}/{docId}`)
	.onCreate(async (change, context) => {
		try {
			const id = context.params.docId;
			const data = change?.data() as Sale;
			const last_sale = await sales.getLast();
			const old_number = last_sale?.sale_id || AppConfig.SALE_COUNT_INIT;
			const sale_id = old_number + 1;

			await sales.setOne({ sale_id }, id);
			data?.products?.forEach(async (item) => {
				const { product, quantity } = item;
				await products.subtractFromStock(product?.id, quantity);
			});

			const transaction = {
				amount: data.total,
				color: Colors.GREEN,
				date: admin.firestore.Timestamp.now(),
				customer_id: data.customer_id,
				description: `${data.quantity} product${
					data.quantity === 1 ? '' : 's'
				} selled.`,
				entry_balance: data.entry_balance,
				type: TransactionsTypes.ENTRY,
				image: data.image || null,
			};

			await transactions.setOne(transaction);
		} catch (error) {
			console.error(error);
		}
	});
