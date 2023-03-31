export const Capitalize = (text: string): string => {
	if (typeof text !== 'string') return '';
	const data: string[] = [];
	const words = text.split(' ');
	words.forEach((word: string) => {
		const body = word.charAt(0).toUpperCase() + word.slice(1);
		data.push(body);
	});
	return data.join(' ');
};
