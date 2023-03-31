import { EmailsTemplates } from '../../enums/emails_templates';
import { Mail } from './mail';

export class WelcomeEmail extends Mail {
	constructor(name: string, password: string) {
		const data = { name, password };
		super(EmailsTemplates.WELCOME, data);
	}
}
