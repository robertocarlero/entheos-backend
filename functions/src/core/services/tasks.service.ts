import { Task } from './../interfaces/task';
import { AppConfig } from '../app-config';
import { DBCrud } from '../classes/db-crud';
import { Colors } from '../enums/colors';

export class TasksService extends DBCrud {
	protected PATH = AppConfig.PATH_TASKS;

	public static readonly DEFAULT_COLOR = Colors.RED;

	constructor() {
		super();
	}

	public setOne(data: any, id?: string) {
		return this.set(data, id);
	}

	public getAllToday() {
		return new Promise<Task[]>(async (resolve, reject) => {
			try {
				const today = new Date();
				today.setUTCHours(-4, 0, 0, 0);
				const tomorrow = new Date();
				tomorrow.setUTCHours(-4, 23, 59, 59);
				tomorrow.setDate(today.getDate() + 1);
				const REF = this.db
					.collection(this.PATH)
					.orderBy('schedule')
					.where('completed', '==', false)
					.where('notify', '==', true)
					.startAt(today)
					.endBefore(tomorrow);
				const RESPONSE = await REF.get();
				const DATA = RESPONSE.docs.map((doc) => this.transformDoc(doc));
				resolve(DATA);
			} catch (error) {
				reject(error);
			}
		});
	}
}
