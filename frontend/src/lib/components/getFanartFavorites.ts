import type { FanartFavoritesResponse } from "$lib/pocketbase-types"
import Pocketbase from "pocketbase";

export async function getFanartFavorites(fanart: string, pb: Pocketbase): Promise<string[]> {
	const response = await pb.collection("fanart_favorites").getFullList<FanartFavoritesResponse>({
		filter: pb.filter(`target = {:fanart}`, { fanart }),
		requestKey: null
	})
	return response.map((fa) => fa.id)
}
