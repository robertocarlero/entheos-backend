import { DBCrud } from '../classes/db-crud';
import { AppConfig } from '../app-config';
import { Sale } from '../interfaces/sale';
import { Customer } from '../interfaces/customer';

export class SalesService extends DBCrud {
	protected PATH = AppConfig.PATH_SALES;

	constructor() {
		super();
	}

	public getLast(): Promise<Sale> {
		return new Promise<Sale>(async (resolve, reject) => {
			try {
				const collection = this.db.collection(this.PATH);
				const res = await collection
					.orderBy('sale_id', 'desc')
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

	public getAllByCustomer(customer_id: Customer['id']): Promise<Sale[]> {
		return new Promise<Sale[]>(async (resolve, reject) => {
			try {
				const REF = this.db
					.collection(this.PATH)
					.where('customer_id', '==', customer_id);
				const RESPONSE = await REF.get();
				const DATA = RESPONSE.docs.map((doc) => this.transformDoc(doc));
				resolve(DATA);
			} catch (error) {
				reject(error);
			}
		});
	}

	public getOne(id: string): Promise<Sale> {
		return this.get(id);
	}

	public deleteOne(id: string) {
		return this.delete(id);
	}

	public setOne(data: any, id?: string) {
		return this.set(data, id);
	}
}
