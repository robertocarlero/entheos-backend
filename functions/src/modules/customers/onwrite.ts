import * as functions from 'firebase-functions';
import { StringToArray } from '../../core/utils/string-to-array';
import { GenerateThumbnail } from '../../core/utils/generate-thumbnail';
import { AppConfig } from '../../core/app-config';
import { Customer } from '../../core/interfaces/customer';
import { CustomersService } from '../../core/services/customers.service';

const customers = new CustomersService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_CUSTOMERS}/{docId}`)
	.onWrite(async (change, context) => {
		const id: string = context.params.docId;
		try {
			if (!change.after.exists) return;
			const old_data = change?.before?.data() as Customer;
			const data = change?.after?.data() as Customer;
			let new_data = { search: [] } as any;
			let changed = false;

			if (old_data?.name !== data?.name || old_data?.dni !== data?.dni) {
				changed = true;
				const name_search = StringToArray(data?.name);
				const dni_search = StringToArray(data?.dni);
				const id_search = StringToArray(data?.customer_id);
				new_data['search'] = [
					...name_search,
					...dni_search,
					...id_search,
				];
			}

			if (old_data?.avatar?.url !== data?.avatar?.url && !!data.avatar) {
				changed = true;
				new_data['avatar'] = await GenerateThumbnail(data.avatar);
			}

			if (!changed) return;

			await customers.setOne(new_data, id);
		} catch (error) {
			return console.error(error);
		}
	});
