export function isInSeason(): boolean {
	const date = new Date();
	const month = date.getMonth(); // 0 = January, 11 = December
	const day = date.getDate();
	const inSeason = (month === 11 && day >= 4) || (month === 0 && day <= 6);
	return inSeason;
}
