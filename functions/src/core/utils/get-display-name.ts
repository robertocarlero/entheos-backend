import { Capitalize } from './words/capitalize';
import { CleanWords } from './words/clean-words';

export const GetDisplayName = (first: string, last: string) => {
	let name = '';
	const first_name = CleanWords(first);
	const last_name = CleanWords(last);
	name = `${first_name} ${last_name}`;
	name = CleanWords(name);
	name = Capitalize(name);
	return name;
};
