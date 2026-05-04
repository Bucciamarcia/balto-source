// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import Pocketbase, { type AuthRecord } from "pocketbase";
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: Pocketbase;
			user: AuthRecord;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
