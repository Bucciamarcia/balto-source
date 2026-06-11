import type Pocketbase from "pocketbase";

export function isAuthenticated(pb: Pocketbase): boolean {
	return pb.authStore.isValid;
}
