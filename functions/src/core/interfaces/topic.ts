import { Member } from './member';
import { DBDoc } from './db-doc';

export interface Topic extends DBDoc {
	name: string;
	title: string;
	roles: Member['role'][];
	icon: string;
}
