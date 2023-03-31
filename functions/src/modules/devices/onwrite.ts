import * as functions from 'firebase-functions';

import { StringToArray } from '../../core/utils/string-to-array';
import { GenerateThumbnail } from '../../core/utils/generate-thumbnail';
import { AppConfig } from '../../core/app-config';
import { Device } from '../../core/interfaces/device';
import { DevicesService } from '../../core/services/devices.service';
import { DeviceStatuses } from '../../core/enums/device-statuses';
import { TasksService } from '../../core/services/tasks.service';

const devices = new DevicesService();
const tasks = new TasksService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_DEVICES}/{docId}`)
	.onWrite(async (change, context) => {
		const id: string = context.params.docId;
		try {
			if (!change.after.exists) return;
			const old_data = change?.before?.data() as Device;
			const data = change.after.data() as Device;
			let new_data = { search: [] } as any;
			let changed = false;

			const search = GetSearchArray(data);
			if (search.join('') !== old_data?.search?.join('')) {
				changed = true;
				new_data['search'] = search;
			}

			if (old_data?.image?.url !== data?.image?.url && !!data.image) {
				changed = true;
				new_data['image'] = await GenerateThumbnail(data.image);
			}

			await CheckTaskChange(id, data);

			if (!changed) return;
			if (!data.member_id) new_data.member_id = null;

			await devices.setOne(new_data, id);
		} catch (error) {
			return console.error(error);
		}
	});

const GetSearchArray = (data: Device): string[] => {
	const model_array = StringToArray(data?.model);
	const brand_array = StringToArray(data?.brand);
	const code_array = StringToArray(data?.code);
	const serial_array = StringToArray(data?.serial);
	return [...model_array, ...brand_array, ...code_array, ...serial_array];
};

const CheckTaskChange = (id: string, data: Device) => {
	const body = {
		color: TasksService.DEFAULT_COLOR,
		completed:
			data.status === DeviceStatuses.FINISHED ||
			data.status === DeviceStatuses.DELIVERED,
		customer_id: data?.customer_id || null,
		device_id: id || null,
		member_id: data?.member_id || null,
		description: data?.description || null,
		title: `Work ${data?.brand} ${data?.model}`,
	};
	return tasks.setOne(body, id);
};
