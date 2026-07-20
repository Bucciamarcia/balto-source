import { PUBLIC_POCKETBASE_URL } from "$lib/pocketbase/url";

export async function moderateText(t: string): Promise<ModerateResult> {
	const response = await fetch(`${PUBLIC_POCKETBASE_URL}/moderate_text`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"text": t
		})
	})
	if (!response.ok) {
		throw new Error(await response.text())
	}
	const r = await response.text()
	const jsonResponse = JSON.parse(r)
	console.log(jsonResponse)
	const action = jsonResponse.action
	console.log(action)
	const toReturn: ModerateResult = action
	console.log(toReturn)
	return toReturn
}
export async function moderateImageUrl(url: string): Promise<ModerateResult> {
	const response = await fetch(`${PUBLIC_POCKETBASE_URL}/moderate_image_url`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"url": url
		})
	})
	if (!response.ok) {
		throw new Error(await response.text())
	}
	const r = await response.text()
	const jsonResponse = JSON.parse(r)
	console.log(jsonResponse)
	const action = jsonResponse.action
	console.log(action)
	const toReturn: ModerateResult = action
	console.log(toReturn)
	return toReturn
}
export async function moderateImageData(file: File): Promise<ModerateResult> {
	const imageType = file.type
	const imageData = fileToBase64(file)
	const response = await fetch(`${PUBLIC_POCKETBASE_URL}/moderate_image_bytes`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"imageType": imageType, "imageData": await imageData
		})
	})
	if (!response.ok) {
		throw new Error(await response.text())
	}
	const r = await response.text()
	const jsonResponse = JSON.parse(r)
	console.log(jsonResponse)
	const action = jsonResponse.action
	console.log(action)
	const toReturn: ModerateResult = action
	console.log(toReturn)
	return toReturn
}
async function fileToBase64(file: File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer();
	const bytes = new Uint8Array(arrayBuffer);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}
type ModerateResult = "allow" | "moderate" | "remove"
