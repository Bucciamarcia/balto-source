<script lang="ts">
	import FormattedDate from '#lib/components/FormattedDate.svelte';
	import type { Source } from '#lib/components/getSourceSlug.js';
	import { m } from '#lib/paraglide/messages.js';
	import type { Locale } from '#lib/paraglide/runtime.js';
	import type { FanfictionsResponse, UsersResponse } from '#lib/pocketbase-types.js';
	import type { FavoriteByFanfiction } from './+page.server';

	let {
		fanfictions,
		fanfictionsFavorites,
		language,
		source
	}: {
		fanfictions: FanfictionsResponse<{ author: UsersResponse }>[];
		fanfictionsFavorites: FavoriteByFanfiction[];
		language: Locale;
		source: Source;
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
	<h2>{m.ff_empty_gallery()}</h2>
{/if}
<div class="flex flex-wrap gap-2">
	{#each fanfictions as fanfiction}
		<div class="flex flex-col">
			<a href={`/${language}/${source}/fanfiction/${fanfiction.id}`}>
				<p class="mt-2 text-center">{fanfiction.title}</p>
			</a>
			<p class="text-center">
				{m.ff_gallery_by()}
				<a href={`/${language}/profile?id=${fanfiction.author}`}>
					{fanfiction.expand.author.username}
				</a>
			</p>
			<p class="text-center">
				{getFavs(fanfiction.id)}
				{m.ff_gallery_favs()}
			</p>
			<p class="mt-2 text-center text-xs italic">
				<FormattedDate date={new Date(fanfiction.created)} showTime={false} />
			</p>
		</div>
	{/each}
</div>
