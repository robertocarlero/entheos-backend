import { DBCrud } from '../classes/db-crud';
import { AppConfig } from '../app-config';
import { Product } from '../interfaces/product';

export class ProductsService extends DBCrud {
	protected PATH = AppConfig.PATH_PRODUCTS;

	constructor() {
		super();
	}

	public getLast(): Promise<Product> {
		return new Promise<Product>(async (resolve, reject) => {
			try {
				const collection = this.db.collection(this.PATH);
				const res = await collection
					.orderBy('product_id', 'desc')
					.limit(1)
					.get();
				const data = this.transformDoc(res.docs[0]);
				resolve(data);
			} catch (error) {
				console.error(error);
				reject(error);
			}
		});
	}

	public getOne(id: string): Promise<Product> {
		return this.get(id);
	}

	public deleteOne(id: string) {
		return this.delete(id);
	}

	public setOne(data: any, id?: string) {
		return this.set(data, id);
	}

	public subtractFromStock(id: string, quantity: number) {
		return new Promise<string>(async (resolve, reject) => {
			try {
				const data = await this.get(id);
				const body = { stock: data.stock - quantity };
				const res = await this.set(body, id);
				resolve(res);
			} catch (error) {
				reject(error);
			}
		});
	}
}
