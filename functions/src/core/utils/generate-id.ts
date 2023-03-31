export const GenerateId = (length: number = 20): string => {
	const charset =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let response = '';
	for (let i = 0; i < length; ++i) {
		const index = Math.floor(Math.random() * charset.length);
		response += charset.charAt(index);
	}
	return response;
};
