import { Topic } from './../interfaces/topic';
import { AppConfig } from './../app-config';
import * as admin from 'firebase-admin';

import { UsersService } from './users.service';

import { Member } from './../interfaces/member';
import { Notification } from '../classes/notification';

import { DBCrud } from '../classes/db-crud';

export class NotificationsService extends DBCrud {
	private messaging = admin.messaging();
	private users = new UsersService();
	protected PATH = AppConfig.PATH_TOPICS;

	public async send(userId: Member['id'], message: Notification) {
		try {
			const devices = await this.getUserDevices(userId);
			if (!devices.length) return;

			const body: admin.messaging.MulticastMessage = {
				tokens: devices,
				notification: message,
			};

			const { successCount, failureCount } =
				await this.messaging.sendMulticast(body);

			console.log(
				`Successfully sent: ${successCount} -- Failed: ${failureCount}`
			);
		} catch (error) {
			console.log('Error sending notification:', error);
		}
	}

	public async sendToTopic(
		topic: admin.messaging.TopicMessage['topic'],
		message: admin.messaging.MessagingPayload
	) {
		try {
			const { messageId } = await this.messaging.sendToTopic(
				topic,
				message
			);

			console.log(`Successfully sent to topic ${topic}: ${messageId}`);
		} catch (error) {
			console.log(`Error sending notifications:`, error);
		}
	}

	public async sendAll(messages: admin.messaging.Message[]) {
		try {
			const { successCount, failureCount } = await this.messaging.sendAll(
				messages
			);
			console.log(
				`Successfully sent: ${successCount} -- Failed: ${failureCount}`
			);
		} catch (error) {
			console.log(`Error sending notifications:`, error);
		}
	}

	public async subscribeToTopic(userId: Member['id'], topic: Topic['name']) {
		try {
			const devices = await this.getUserDevices(userId);
			if (!devices.length) return;
			const response = await this.messaging.subscribeToTopic(
				devices,
				topic
			);
			console.log('Successfully subscribed to topic:', response);
		} catch (error) {
			console.log('Error subscribing to topic:', error);
		}
	}

	public async unsubscribeFromTopic(
		userId: Member['id'],
		topic: Topic['name']
	) {
		try {
			const devices = await this.getUserDevices(userId);
			if (!devices.length) return;
			const response = await this.messaging.unsubscribeFromTopic(
				devices,
				topic
			);
			console.log('Successfully unsubscribed from topic:', response);
		} catch (error) {
			console.log('Error unsubscribing from topic:', error);
		}
	}

	public async updateSubscriptionsTopicsByRole(userId: Member['id']) {
		try {
			const user: Member = await this.users.getOne(userId);
			const { role, topics } = user || {};

			const response = await this.db
				.collection(this.PATH)
				.where('roles', 'array-contains', role)
				.get();

			const all_topics = response.docs.map((doc) =>
				this.transformDoc(doc)
			);

			topics.forEach(async (topic) => {
				const hasPermission = all_topics.some(
					({ name }) => topic === name
				);
				if (!hasPermission) {
					await this.unsubscribeFromTopic(userId, topic);
				} else {
					await this.subscribeToTopic(userId, topic);
				}
			});

			console.log('Successfully update subscription by role.');
		} catch (error) {
			console.log('Error updating subscription by rol:', error);
		}
	}

	private async getUserDevices(userId: Member['id']) {
		const user: Member = await this.users.getOne(userId);

		return user?.devices || [];
	}
}
