import { Topic } from './topic';
import * as admin from 'firebase-admin';

import { Amount } from './amount';
import { User } from './user';
import { Roles } from '../enums/roles';
import { Occupations } from '../enums/occupations';

export interface Member extends User {
	member_id: string;
	role: Roles;
	firstname: string;
	lastname: string;
	start_date: admin.firestore.Timestamp;
	occupation: Occupations;
	balance: Amount;
	topics: Topic['name'][];
}
