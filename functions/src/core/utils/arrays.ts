export const arraysAreSame = (array1: any[], array2: any[]) => {
	const array1_string = (array1 || []).join('-');
	const array2_string = (array2 || []).join('-');

	return array1_string === array2_string;
};
