export const CleanWords = (text: string) => {
	if (typeof text !== 'string') return '';
	let response = String(text);
	response = response.toLowerCase();
	response = response.trim();
	return response;
};
