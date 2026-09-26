// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { UsersResponse } from "$lib/pocketbase-types";
import Pocketbase, { type AuthRecord } from "pocketbase";
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: Pocketbase;
			auth: AuthRecord;
			user: UsersResponse | undefined;
			isVerified: boolean;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
