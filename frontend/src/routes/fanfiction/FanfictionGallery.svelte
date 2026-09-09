<script lang="ts">
	import FormattedDate from '$lib/components/FormattedDate.svelte';
	import type { FanfictionsResponse, UsersResponse } from '$lib/pocketbase-types';
	import type { FavoriteByFanfiction } from './+page.server';

	let {
		fanfictions,
		fanfictionsFavorites
	}: {
		fanfictions: FanfictionsResponse<{ author: UsersResponse }>[];
		fanfictionsFavorites: FavoriteByFanfiction[];
	} = $props();

	function getFavs(id: string): number {
		const fa = fanfictionsFavorites.find((f) => f.fanfiction == id);
		if (!fa) {
			return 0;
		}
		return fa.favorites.length;
	}
</script>

{#if fanfictions.length === 0}
	<h2>This gallery is empty</h2>
{/if}
<div class="flex flex-wrap gap-2">
	{#each fanfictions as fanfiction}
		<div class="flex flex-col">
			<a href={`/fanfiction/${fanfiction.id}`}>
				<p class="mt-2 text-center">{fanfiction.title}</p>
			</a>
			<p class="text-center">
				By <a href={`/profile?id=${fanfiction.author}`}>{fanfiction.expand.author.username}</a>
			</p>
			<p class="text-center">
				{getFavs(fanfiction.id)} favorites
			</p>
			<p class="mt-2 text-center text-xs italic">
				On <FormattedDate date={new Date(fanfiction.created)} showTime={false} />
			</p>
		</div>
	{/each}
</div>
