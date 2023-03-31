import { Topic } from './topic';
import { DBDoc } from './db-doc';

export interface AppNotification extends DBDoc {
	notification: {
		title: string;
		body: string;
	};
	topic: Topic['name'];
}
