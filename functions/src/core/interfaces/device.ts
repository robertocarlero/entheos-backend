import { DeviceStatuses } from '../enums/device-statuses';
import { DeviceTypes } from '../enums/device-types';
import { DBDoc } from './db-doc';
import { Image } from './image';
import * as admin from 'firebase-admin';

export interface Device extends DBDoc {
	model: string;
	brand: string;
	code: string;
	serial: string;
	customer_id: string;
	member_id: string;
	type: DeviceTypes;
	status: DeviceStatuses;
	admission_date: admin.firestore.Timestamp;
	egress_date: admin.firestore.Timestamp;
	finished_date: admin.firestore.Timestamp;
	description: string;
	image: Image;
	color: string;
	details?: string;
}
