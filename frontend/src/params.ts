import { defineParams } from '@sveltejs/kit/params';

const SOURCES = ['hub', 'balto'];
type Source = (typeof SOURCES)[number];
const isSource = (value: string): value is Source => (SOURCES as readonly string[]).includes(value);

export const params = defineParams({
	source: (param: string) => {
		if (!isSource(param)) {
			return;
		}
		return param;
	}
});
