import { Amount } from './amount';
import { DBDoc } from './db-doc';
import { Image } from './image';

export interface Product extends DBDoc {
	description: string;
	image: Image;
	name: string;
	price: Amount;
	product_id: number;
	stock: number;
}
