import * as functions from 'firebase-functions';
import { StringToArray } from '../../core/utils/string-to-array';
import { GenerateThumbnail } from '../../core/utils/generate-thumbnail';
import { AppConfig } from '../../core/app-config';
import { Sale } from '../../core/interfaces/sale';
import { SalesService } from '../../core/services/sales.service';
import { CustomersService } from '../../core/services/customers.service';

const sales = new SalesService();
const customers = new CustomersService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_SALES}/{docId}`)
	.onWrite(async (change, context) => {
		const id: string = context.params.docId;
		try {
			if (!change.after.exists) return;
			const old_data = change?.before?.data() as Sale;
			const data = change.after.data() as Sale;
			let new_data = { search: [] } as any;
			let changed = false;

			if (old_data?.customer_id !== data?.customer_id) {
				changed = true;
				const customer = await customers.getOne(data?.customer_id);
				const name_search = StringToArray(customer?.name);
				const id_search = StringToArray(data?.sale_id);
				new_data['search'] = [...name_search, ...id_search];
				if (!data?.description) {
					new_data[
						'description'
					] = `${customer?.name} bought ${data?.quantity} products`;
				}
			}

			if (old_data?.image?.url !== data?.image?.url && !!data.image) {
				changed = true;
				new_data['image'] = await GenerateThumbnail(data.image);
			}

			if (!changed) return;

			await sales.setOne(new_data, id);
		} catch (error) {
			return console.error(error);
		}
	});
