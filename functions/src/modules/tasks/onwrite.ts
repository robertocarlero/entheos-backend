import * as functions from 'firebase-functions';

import { NotificationsService } from './../../core/services/notifications.service';

import { Task } from '../../core/interfaces/task';
import { AppConfig } from '../../core/app-config';
import { Notification } from '../../core/classes/notification';

const notifications = new NotificationsService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_TASKS}/{docId}`)
	.onWrite(async (change) => {
		try {
			if (!change.after.exists) return;
			const old_data = change?.before?.data() as Task;
			const data = change.after.data() as Task;

			if (old_data.member_id === data.member_id) return;
			if (data.changed_by === data.member_id) return;

			const message = new Notification(
				'New task assigned to you',
				data.title
			);

			await notifications.send(data.member_id, message);
		} catch (error) {
			return console.error(error);
		}
	});
