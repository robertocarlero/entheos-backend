import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AppConfig } from '../../core/app-config';
import { Task } from '../../core/interfaces/task';
import { TasksService } from '../../core/services/tasks.service';

const tasks = new TasksService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_TASKS}/{docId}`)
	.onCreate(async (change, context) => {
		try {
			const { completed, notify, schedule } = change.data() as Task;
			const id = context.params.docId;

			const now = admin.firestore.Timestamp.now().toMillis();
			const tomorrow = now + 1000 * 60 * 60 * 24;

			const body = {
				completed: typeof completed === 'boolean' ? completed : false,
				schedule:
					schedule || admin.firestore.Timestamp.fromMillis(tomorrow),
				notify: typeof notify === 'boolean' ? notify : false,
			};
			await tasks.setOne(body, id);
		} catch (error) {
			console.error(error);
		}
	});
