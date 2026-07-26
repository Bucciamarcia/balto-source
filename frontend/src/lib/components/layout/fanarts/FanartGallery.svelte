<script lang="ts">
	import FormattedDate from '$lib/components/FormattedDate.svelte';
	import type { FanartsResponse, UsersResponse } from '$lib/pocketbase-types';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';
	import type { FavoriteByFanart } from '../../../../routes/fanart/proxy+page.server';

	function getFanartUrl(id: string, image: string): string {
		return `${PUBLIC_POCKETBASE_URL}/api/files/fanarts/${id}/${image}?thumb=300x200f`;
	}
	let {
		fanarts,
		fanartsFavorites
	}: {
		fanarts: FanartsResponse<{ author: UsersResponse }>[];
		fanartsFavorites: FavoriteByFanart[];
	} = $props();

	function getFavs(id: string): number {
		const fa = fanartsFavorites.find((f) => f.fanart == id);
		if (!fa) {
			return 0;
		}
		return fa.favorites.length;
	}
</script>

{#if fanarts.length === 0}
	<h2>This gallery is empty</h2>
{/if}
<div class="flex flex-wrap gap-2">
	{#each fanarts as fanart}
		<div class="flex flex-col">
			<a href={`/fanart/${fanart.id}`}>
				<img src={getFanartUrl(fanart.id, fanart.image)} alt="{fanart.title} by {fanart.author}" />
			</a>
			<a href={`/fanart/${fanart.id}`}>
				<p class="mt-2 text-center">{fanart.title}</p>
			</a>
			<p class="text-center">
				By <a href={`/profile?id=${fanart.author}`}>{fanart.expand.author.username}</a>
			</p>
			<p class="text-center">
				{getFavs(fanart.id)} favorites
			</p>
			<p class="mt-2 text-center text-xs italic">
				On <FormattedDate date={new Date(fanart.created)} showTime={false} />
			</p>
		</div>
	{/each}
</div>
