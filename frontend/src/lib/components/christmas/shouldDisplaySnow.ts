import { isInSeason } from './isInSeason';

export function shouldDisplaySnow(cookieSays: boolean): boolean {
	const inSeason = isInSeason();
	return inSeason && cookieSays;
}
