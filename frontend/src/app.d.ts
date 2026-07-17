// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { UsersResponse } from "$lib/pocketbase-types";
import Pocketbase from "pocketbase";
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: Pocketbase;
			user: UsersResponse?;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
