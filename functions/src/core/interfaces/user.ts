import { DBDoc } from './db-doc';
import { Image } from './image';

export interface User extends DBDoc {
	id: string;
	name: string;
	avatar: Image;
	email: string;
	password: string;
	gender: 'male' | 'female' | 'other';
	phoneNumber: string;
	whatsappNumber: string;
	dni: string;
	birthday: Date;
	devices: string[];
}
