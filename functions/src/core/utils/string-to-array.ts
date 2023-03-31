export const StringToArray = (value: string | number): Array<string> => {
	const response: Array<string> = [];
	if (!value) return response;
	let text = `${value}`;
	text = text.trim();
	text = text.toLowerCase();
	for (let i = 1; i <= text.length; i++) {
		const substring = text.substring(0, i).trim();
		if (response.indexOf(substring) === -1) {
			response.push(substring);
		}
	}
	const words = text.split(' ');
	words.forEach((word) => {
		for (let i = 1; i <= word.length; i++) {
			const substring = word.substring(0, i);
			if (response.indexOf(substring) === -1) {
				response.push(substring);
			}
		}
	});
	return response;
};
