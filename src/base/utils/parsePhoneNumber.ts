const parsePhoneNumber = (str: string) => {
	let phone = str.replace(/[\s\(\)\-]/gi, '');
	if (phone.length > 0 && phone[0] !== '+') {
		phone = `+${phone}`;
	}
	return phone;
};

export default parsePhoneNumber;
