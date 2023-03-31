import { AppConfig } from '../app-config';
import { DBCrud } from '../classes/db-crud';
import { Device } from '../../core/interfaces/device';
import { Customer } from '../interfaces/customer';
import { DeviceStatuses } from '../enums/device-statuses';

export class DevicesService extends DBCrud {
	protected PATH = AppConfig.PATH_DEVICES;

	constructor() {
		super();
	}

	public setOne(data: any, id?: string) {
		return this.set(data, id);
	}

	public deleteOne(id: string) {
		return this.delete(id);
	}

	public getAllByCustomer(customer_id: Customer['id']): Promise<Device[]> {
		return new Promise<Device[]>(async (resolve, reject) => {
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

	public getAllUnallocated() {
		return new Promise<Device[]>(async (resolve, reject) => {
			try {
				const REF = this.db
					.collection(this.PATH)
					.where('member_id', '==', null);
				const RESPONSE = await REF.get();
				const DATA = RESPONSE.docs.map((doc) => this.transformDoc(doc));
				resolve(DATA);
			} catch (error) {
				reject(error);
			}
		});
	}

	public getAllDelayed() {
		return new Promise<Device[]>(async (resolve, reject) => {
			try {
				const fourDaysAgo = new Date();
				fourDaysAgo.setDate(
					fourDaysAgo.getDate() - AppConfig.DEVICES_DELAY_DAYS
				);
				const REF = this.db
					.collection(this.PATH)
					.orderBy('admission_date')
					.where('status', 'in', [
						DeviceStatuses.IN_LINE,
						DeviceStatuses.IN_WORK,
						DeviceStatuses.WAITING,
					])
					.endAt(fourDaysAgo);
				const RESPONSE = await REF.get();
				const DATA = RESPONSE.docs.map((doc) => this.transformDoc(doc));
				resolve(DATA);
			} catch (error) {
				reject(error);
			}
		});
	}
}
