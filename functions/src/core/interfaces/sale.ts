import { User } from './user';
import { Amount } from './amount';
import { DBDoc } from './db-doc';
import { ItemSelled } from './item-selled';
import { Customer } from '../../../../../backend/functions/src/core/interfaces/customer';
import { Image } from '../../../../../backend/functions/src/core/interfaces/image';

export interface Sale extends DBDoc {
	products: ItemSelled[];
	quantity: number;
	discount: number; // percentage
	total: Amount;
	sale_id: number;
	customer_id: Customer['id'];
	image: Image;
	description: string;
	entry_balance: User['id'];
}
