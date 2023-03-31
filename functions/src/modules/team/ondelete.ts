import * as functions from 'firebase-functions';
import { AuthService } from '../../core/services/auth.service';
import { AppConfig } from '../../core/app-config';

const auth = new AuthService();

export const method = functions.firestore
	.document(`${AppConfig.PATH_USERS}/{docId}`)
	.onDelete(async (change, context) => {
		try {
			const uid = context.params.docId;
			await auth.delete(uid);
		} catch (error) {
			console.error(error);
		}
	});
