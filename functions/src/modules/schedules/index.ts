import * as functions from 'firebase-functions';
import { isSaturday, isSunday } from '../../core/utils/dates';

import devicesUnallocated from './devices-unallocated';
import overdueDevices from './overdue-devices';
import todayTasks from './today-tasks';

export const everyMorningAt9 = functions.pubsub
	.schedule('0 9 * * *')
	.timeZone('America/Caracas')
	.onRun(() => {
		todayTasks();
		if (isSunday()) return;
		devicesUnallocated();
		overdueDevices();
	});

export const everyNoon = functions.pubsub
	.schedule('0 12 * * *')
	.timeZone('America/Caracas')
	.onRun(() => {
		todayTasks();
		if (isSunday() || isSaturday()) return;
		devicesUnallocated();
		overdueDevices();
	});
