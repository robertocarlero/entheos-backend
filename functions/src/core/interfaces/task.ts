import { DBDoc } from './db-doc';
import { Customer } from './customer';
import { Member } from './member';
import { Device } from './device';
import * as admin from 'firebase-admin';

export interface Task extends DBDoc {
	schedule: admin.firestore.Timestamp;
	notify: boolean;
	completed: boolean;
	color: string;
	description: string;
	title: string;
	device_id: Device['id'];
	customer_id: Customer['id'];
	member_id: Member['id'];
}
