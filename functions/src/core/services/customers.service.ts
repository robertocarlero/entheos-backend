import { DBCrud } from '../classes/db-crud';
import { AppConfig } from '../app-config';
import { Customer } from '../interfaces/customer';

export class CustomersService extends DBCrud {
	protected PATH = AppConfig.PATH_CUSTOMERS;

	constructor() {
		super();
	}

	public getLast(): Promise<Customer> {
		return new Promise<Customer>(async (resolve, reject) => {
			try {
				const collection = this.db.collection(this.PATH);
				const res = await collection
					.orderBy('customer_id', 'desc')
					.limit(1)
					.get();
				const data = this.transformDoc(res?.docs[0]);
				resolve(data);
			} catch (error) {
				console.error(error);
				reject(error);
			}
		});
	}

	public getOne(id: string): Promise<Customer> {
		return this.get(id);
	}

	public deleteOne(id: string) {
		return this.delete(id);
	}

	public setOne(data: any, id?: string) {
		return this.set(data, id);
	}
}
