import * as functions from 'firebase-functions';
import { AppConfig } from '../../core/app-config';
import { CustomersService } from '../../core/services/customers.service';

const customers = new CustomersService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_CUSTOMERS}/{docId}`)
	.onCreate(async (change, context) => {
		try {
			const id = context.params.docId;
			const last_customer = await customers.getLast();
			const old_number =
				last_customer?.customer_id || AppConfig.CUSTOMER_COUNT_INIT;
			const customer_id = old_number + 1;
			await customers.setOne({ customer_id }, id);
		} catch (error) {
			console.error(error);
		}
	});
