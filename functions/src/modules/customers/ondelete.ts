import * as functions from 'firebase-functions';
import { AppConfig } from '../../core/app-config';
import { Device } from '../../core/interfaces/device';
import { Sale } from '../../core/interfaces/sale';
import { DevicesService } from '../../core/services/devices.service';
import { SalesService } from '../../core/services/sales.service';

const devices = new DevicesService();
const sales = new SalesService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_CUSTOMERS}/{docId}`)
	.onDelete(async (change, context) => {
		try {
			const id = context.params.docId;
			const products = await devices.getAllByCustomer(id);
			products.forEach(async (item: Device) => {
				await devices.deleteOne(item?.id);
			});
			const res = await sales.getAllByCustomer(id);
			res.forEach(async (item: Sale) => {
				await sales.deleteOne(item?.id);
			});
		} catch (error) {
			console.error(error);
		}
	});
