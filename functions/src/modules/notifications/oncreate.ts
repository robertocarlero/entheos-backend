import { AppNotification } from './../../core/interfaces/notification';
import * as functions from 'firebase-functions';
import { AppConfig } from '../../core/app-config';
import { NotificationsService } from '../../core/services/notifications.service';

const notifications = new NotificationsService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_NOTIFICATIONS}/{docId}`)
	.onCreate(async (change) => {
		try {
			const { topic, notification } = change.data() as AppNotification;
			notifications.sendToTopic(topic, { notification });
		} catch (error) {
			console.error(error);
		}
	});
