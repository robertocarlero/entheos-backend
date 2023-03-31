import { TasksService } from './../../core/services/tasks.service';
import { NotificationsService } from '../../core/services/notifications.service';

const Tasks = new TasksService();
const notifications = new NotificationsService();

const todayTasks = async () => {
	try {
		const tasks = await Tasks.getAllToday();

		if (!tasks.length) return;

		tasks.forEach(async ({ title, description, member_id }) => {
			const notification = {
				title,
				body: description || '---',
			};

			await notifications.send(member_id, notification);
		});
	} catch (error) {
		console.error(error);
	}
};

export default todayTasks;
