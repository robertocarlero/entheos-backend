import { NotificationsService } from '../../core/services/notifications.service';

import * as admin from 'firebase-admin';

import { DevicesService } from '../../core/services/devices.service';
import { NotificationTopics } from '../../core/enums/notification-topics';

const Devices = new DevicesService();
const notifications = new NotificationsService();

const devicesUnallocated = async () => {
	try {
		const devices = await Devices.getAllUnallocated();

		if (!devices.length) return;

		const messages: admin.messaging.Message[] = devices.map(
			({ brand, model }) => {
				const notification = {
					title: 'Device unallocated',
					body: `${brand} ${model}`,
				};

				return {
					topic: NotificationTopics.DEVICES_UNALLOCATED,
					notification,
				};
			}
		);

		await notifications.sendAll(messages);
	} catch (error) {
		console.error(error);
	}
};

export default devicesUnallocated;
