import * as functions from 'firebase-functions';
import { AppConfig } from '../../core/app-config';
import { Member } from '../../core/interfaces/member';
import { UsersService } from '../../core/services/users.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { GetDisplayName } from '../../core/utils/get-display-name';
import { GetMemberID } from '../../core/utils/get-menber-id';
import { StringToArray } from '../../core/utils/string-to-array';
import { arraysAreSame } from '../../core/utils/arrays';

const users = new UsersService();
const notifications = new NotificationsService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_USERS}/{docId}`)
	.onWrite(async (change, context) => {
		try {
			if (!change.after.exists) return;
			const id = context.params.docId;
			const data = (change?.after?.data() || {}) as Member;
			data.id = id;
			const old_data = (change?.before?.data() || {}) as Member;
			old_data.id = id;
			let new_data = { search: [] } as any;
			let changed = false;

			subscribeToNotificationTopics(data, old_data);

			const name = GetDisplayName(data?.firstname, data?.lastname);
			if (name !== data?.name) {
				changed = true;
				new_data['name'] = name;
			}

			const id_parts = data.member_id ? data.member_id.split('_') : [];
			const old_id = id_parts[0];
			const member_id = GetMemberID(data);
			const ID = TransformID(member_id, id_parts);
			if (old_id !== member_id) {
				changed = true;
				new_data['member_id'] = ID;
			}

			const search = GetSearchArray(name, data.dni, ID);
			if (search.join('') !== old_data?.search?.join('')) {
				changed = true;
				new_data['search'] = search;
			}

			if (!changed) return;

			await users.setOne(new_data, id);
		} catch (error) {
			return console.error(error);
		}
	});

const TransformID = (member_id: string, parts: string[]) => {
	return `${member_id}_${parts[1] || new Date().valueOf()}`;
};

const GetSearchArray = (name: string, dni: string, id: string): string[] => {
	const name_array = StringToArray(name);
	const dni_array = StringToArray(dni);
	const id_array = StringToArray(id);
	return [...name_array, ...dni_array, ...id_array];
};

const subscribeToNotificationTopics = (data: Member, old_data: Member) => {
	const isSameRole = data.role === old_data.role;
	const isSameDevices = arraysAreSame(data?.devices, old_data?.devices);
	const isSameTopics = arraysAreSame(data?.topics, old_data?.topics);

	if (isSameRole && isSameDevices && isSameTopics) return;

	notifications.updateSubscriptionsTopicsByRole(data.id);
};
