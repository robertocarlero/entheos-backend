import { Email } from '../../interfaces/email';
import * as admin from 'firebase-admin';
import { AppConfig } from '../../app-config';
import { EmailsTemplates } from '../../enums/emails_templates';

const db = admin.firestore();

export class Mail {
	protected RECIPIENTS: string[] = [];
	protected TEMPLATE: EmailsTemplates;
	protected DATA: any;

	constructor(template: EmailsTemplates, data: any) {
		this.TEMPLATE = template;
		this.DATA = data;
	}

	public set to(value: string | string[]) {
		switch (typeof value) {
			case 'object':
				this.RECIPIENTS = value;
				break;
			case 'number':
				break;
			case 'string':
				this.RECIPIENTS = [value];
				break;
			default:
				break;
		}
	}

	public addRecipient(email: string) {
		this.RECIPIENTS.push(email);
	}

	public async send(): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				const email = this.getEmail();
				await db.collection(AppConfig.PATH_EMAILS).add(email);
				resolve('Email guardado para enviar exitosamente.');
			} catch (error) {
				console.error(error);
				reject('Hubo un error al intentar guardar el email a enviar.');
			}
		});
	}

	protected getEmail(): Email {
		const response = {
			to: this.RECIPIENTS,
			template: {
				name: this.TEMPLATE,
				data: this.DATA,
			},
		};
		return response;
	}
}
