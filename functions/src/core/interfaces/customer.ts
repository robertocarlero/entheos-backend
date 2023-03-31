import { User } from './user';

export interface Customer extends User {
	customer_id: number;
	pending: boolean;
}
