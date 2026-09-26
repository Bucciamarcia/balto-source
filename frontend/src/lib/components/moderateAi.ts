import { dev } from '$app/env';
import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';
import { TypeSafeClient } from '@typesafe-ai/sdk';
import { env } from '$env/dynamic/private';

export async function moderateText(t: string, category?: string): Promise<ModerateResult> {
	const k = env.TYPESAFE_API_KEY;
	console.log(k);
	const res = await fetch('https://jevtypesafeai.com/api/v1/decide', {
		method: 'POST',
		headers: {
			Authorization: `Bearer jv_live_Jn9GGyagPqgyjJkGg2IfPrGZU4nzZFuPU51MMVyiMJU`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			state: t,
			questions: {
				route: {
					type: 'choice',
					instructions: 'Is this content to be allowed under a PG rating?',
					criteria: {
						allow: 'This content respects a PG rating',
						remove: 'This content is not within PG rating or is blatant spam'
					}
				}
			}
		})
	});
	const { answers } = await res.json();
	console.log(answers);
	return 'allow';
}
export async function moderateImageUrl(url: string): Promise<ModerateResult> {
	if (dev) {
		console.log('Skipping in dev mode');
		return 'allow';
	}
	const response = await fetch(`${PUBLIC_POCKETBASE_URL}/moderate_image_url`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			url: url
		})
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	const r = await response.text();
	const jsonResponse = JSON.parse(r);
	console.log(jsonResponse);
	const action = jsonResponse.action;
	console.log(action);
	const toReturn: ModerateResult = action;
	console.log(toReturn);
	return toReturn;
}
export async function moderateImageData(file: File): Promise<ModerateResult> {
	if (dev) {
		console.log('Skipping in dev mode');
		return 'allow';
	}
	const imageType = file.type;
	const imageData = fileToBase64(file);
	const response = await fetch(`${PUBLIC_POCKETBASE_URL}/moderate_image_bytes`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			imageType: imageType,
			imageData: await imageData
		})
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	const r = await response.text();
	const jsonResponse = JSON.parse(r);
	console.log(jsonResponse);
	const action = jsonResponse.action;
	console.log(action);
	const toReturn: ModerateResult = action;
	console.log(toReturn);
	return toReturn;
}
async function fileToBase64(file: File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer();
	const bytes = new Uint8Array(arrayBuffer);
	let binary = '';
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}
export type ModerateResult = 'allow' | 'moderate' | 'remove';
