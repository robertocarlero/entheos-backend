import { Member } from '../interfaces/member';

export const GetMemberID = (member: Member) => {
	const date = member.start_date.toDate();
	const month = date.getMonth() + 1;
	let id = `${member.occupation[0]}-${member.firstname[0]}${
		member.lastname[0]
	}${month >= 10 ? month : '0' + month}${date.getFullYear()}`;
	id = id.trim();
	id = id.toUpperCase();
	return id;
};
