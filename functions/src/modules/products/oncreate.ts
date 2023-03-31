import * as functions from 'firebase-functions';
import { AppConfig } from '../../core/app-config';
import { ProductsService } from '../../core/services/products.service';

const products = new ProductsService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_PRODUCTS}/{docId}`)
	.onCreate(async (change, context) => {
		try {
			const id = context.params.docId;
			const last_product = await products.getLast();
			const old_number =
				last_product?.product_id || AppConfig.PRODUCT_COUNT_INIT;
			const product_id = old_number + 1;
			await products.setOne({ product_id }, id);
		} catch (error) {
			console.error(error);
		}
	});
