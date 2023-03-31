import * as functions from 'firebase-functions';

import { AppConfig } from '../../core/app-config';

import { Member } from '../../core/interfaces/member';

import { GetDisplayName } from '../../core/utils/get-display-name';

import { UsersService } from './../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';

const auth = new AuthService();
const users = new UsersService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_USERS}/{docId}`)
	.onCreate(async (change, context) => {
		try {
			const id = context.params.docId;
			const member = change?.data() as Member;
			const name = GetDisplayName(member?.firstname, member?.lastname);
			await auth.create(member.email, name, id);
			await users.setOne(
				{ balance: { value: 0, coin: AppConfig.DEFAULT_CURRENCY } },
				id
			);
		} catch (error) {
			console.error(error);
		}
	});
