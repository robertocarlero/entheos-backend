import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { StringToArray } from '../../core/utils/string-to-array';
import { GenerateThumbnail } from '../../core/utils/generate-thumbnail';

import { AppConfig } from '../../core/app-config';
import { NotificationsService } from './../../core/services/notifications.service';
import { ProductsService } from '../../core/services/products.service';

import { Product } from '../../core/interfaces/product';
import { NotificationTopics } from '../../core/enums/notification-topics';

const products = new ProductsService();
const notifications = new NotificationsService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_PRODUCTS}/{docId}`)
	.onWrite(async (change, context) => {
		const id: string = context.params.docId;
		try {
			if (!change.after.exists) return;
			const old_data = change?.before?.data() as Product;
			const { stock, ...data } = change.after.data() as Product;
			let new_data = { search: [] } as any;
			let changed = false;

			if (stock <= 1) {
				const notification: admin.messaging.MessagingPayload = {
					notification: {
						title: `Product ${stock ? 'running' : 'sold'} out`,
						body: data.name,
					},
				};
				await notifications.sendToTopic(
					NotificationTopics.STORE_INVENTORY,
					notification
				);
			}

			if (old_data?.name !== data?.name) {
				changed = true;
				const name_search = StringToArray(data?.name);
				const id_search = StringToArray(data?.product_id);
				new_data['search'] = [...name_search, ...id_search];
			}

			if (old_data?.image?.url !== data?.image?.url && !!data.image) {
				changed = true;
				new_data['image'] = await GenerateThumbnail(data.image);
			}

			if (!changed) return;

			await products.setOne(new_data, id);
		} catch (error) {
			return console.error(error);
		}
	});
