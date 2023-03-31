export function isSunday(date?: Date) {
	const day = (date || new Date()).getDay();
	return day === 0;
}

export function isSaturday(date?: Date) {
	const day = (date || new Date()).getDay();
	return day === 6;
}
