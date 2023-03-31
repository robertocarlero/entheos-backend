export interface Email {
	to?: string[];
	toUids?: string[];
	message?: {
		subject: string;
		html?: string;
		text?: string;
	};
	template?: {
		name: string;
		data: any;
	};
}
