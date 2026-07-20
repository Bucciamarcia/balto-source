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

type ModerateResult = "allow" | "moderate" | "remove"
