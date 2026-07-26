import { PUBLIC_POCKETBASE_URL } from "./pocketbase/url";

// This function validates a Cloudflare Turnstile token with the backend service.
// @param r The Turnstile response token provided by the client.
// @returns A promise that resolves to true if the token is valid, false otherwise.
export async function verifyTurnstile(r: string): Promise<boolean> {
	const response = await fetch(`${PUBLIC_POCKETBASE_URL}/turnstile_validation`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"response": r
		})
	})
	if (!response.ok) {
		return false;
	}
	return true;
}
