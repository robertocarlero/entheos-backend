import { NotificationsService } from '../../core/services/notifications.service';

import * as admin from 'firebase-admin';

import { DevicesService } from '../../core/services/devices.service';
import { NotificationTopics } from '../../core/enums/notification-topics';

const Devices = new DevicesService();
const notifications = new NotificationsService();

const overdueDevices = async () => {
	try {
		const devices = await Devices.getAllDelayed();

		if (!devices.length) return;

		const messages: admin.messaging.Message[] = devices.map(
			({ brand, model }) => {
				const notification = {
					title: 'Overdue Device',
					body: `${brand} ${model}`,
				};

				return {
					topic: NotificationTopics.OVERDUE_DEVICES,
					notification,
				};
			}
		);

		await notifications.sendAll(messages);
	} catch (error) {
		console.error(error);
	}
};

export default overdueDevices;
