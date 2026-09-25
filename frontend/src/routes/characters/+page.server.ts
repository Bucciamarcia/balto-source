import type { CharacterFavoritesResponse, CharactersResponse, UsersResponse } from "$lib/pocketbase-types";
import type { PageServerLoad } from "./$types";

export type FavoriteByCharacter = {
	character: string;
	favorites: string[];
}

export const load: PageServerLoad = async ({ locals }) => {
	const characters = await locals.pb.collection("characters")
		.getFullList<CharactersResponse<{ owner: UsersResponse }>>({ expand: "owner" })
	let favoritesByCharacter: FavoriteByCharacter[];
}
