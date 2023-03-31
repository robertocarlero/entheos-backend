import * as admin from 'firebase-admin';
import { GoodbyeEmail } from '../classes/mails/goodbye-email';
import { WelcomeEmail } from '../classes/mails/welcome-email';
import { GenerateId } from '../utils/generate-id';

export class AuthService {
	public create(email: string, name: string, uid?: string) {
		return new Promise(async (resolve, reject) => {
			try {
				const user = this.getUser(email, name, uid);
				await admin.auth().createUser(user);
				const mail = new WelcomeEmail(name, user.password as string);
				mail.addRecipient(email);
				await mail.send();
				resolve('Usuario creado con exito.');
			} catch (error) {
				console.error(error);
				reject('Hubo un error al intentar crear un usuario');
			}
		});
	}

	public delete(uid: string) {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await admin.auth().getUser(uid);
				await admin.auth().deleteUser(uid);
				const mail = new GoodbyeEmail(user.displayName as string);
				mail.addRecipient(user.email as string);
				await mail.send();
			} catch (error) {
				reject(error);
			}
		});
	}

	private getUser(email: string, name: string, uid?: string) {
		const password = GenerateId(10);
		const response: admin.auth.CreateRequest = {
			email,
			displayName: name,
			uid: uid || GenerateId(),
			password,
		};
		return response;
	}
}
