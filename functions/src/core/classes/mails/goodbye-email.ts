import { EmailsTemplates } from '../../enums/emails_templates';
import { Mail } from './mail';

export class GoodbyeEmail extends Mail {
	constructor(name: string) {
		const data = { name };
		super(EmailsTemplates.GOODBYE, data);
	}
}
