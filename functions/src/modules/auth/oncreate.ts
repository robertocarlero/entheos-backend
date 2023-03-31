import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UsersService } from '../../core/services/users.service';

const users = new UsersService();

export const method = functions.auth.user().onCreate(async (user) => {
	try {
		const exists = await users.getOne(user.uid);
		if (!!exists) return;
		await admin.auth().deleteUser(user.uid);
	} catch (error) {
		console.error(error);
	}
});
