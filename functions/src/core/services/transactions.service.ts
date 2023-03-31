import { DBCrud } from '../classes/db-crud';
import { AppConfig } from '../app-config';
import { Transaction } from '../interfaces/transaction';

export class TransactionsService extends DBCrud {
	protected PATH = AppConfig.PATH_TRANSACTIONS;

	constructor() {
		super();
	}

	public getLast(): Promise<Transaction> {
		return new Promise<Transaction>(async (resolve, reject) => {
			try {
				const collection = this.db.collection(this.PATH);
				const res = await collection
					.orderBy('code', 'desc')
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

	public getOne(id: string): Promise<Transaction> {
		return this.get(id);
	}

	public deleteOne(id: string) {
		return this.delete(id);
	}

	public setOne(data: any, id?: string) {
		return this.set(data, id);
	}
}
