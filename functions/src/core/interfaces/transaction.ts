import * as admin from 'firebase-admin';

import { Amount } from './amount';
import { Device } from './device';
import { DBDoc } from './db-doc';
import { Image } from './image';
import { User } from './user';

import { TransactionsTypes } from '../enums/transaction-types';

export interface Transaction extends DBDoc {
	amount: Amount;
	code: number;
	customer_id: string;
	member_id: string;
	device_id: Device['id'];
	type: TransactionsTypes;
	date: admin.firestore.Timestamp;
	description: string;
	image: Image;
	color: string;
	entry_balance: User['id'];
	out_balance: User['id'];
}
