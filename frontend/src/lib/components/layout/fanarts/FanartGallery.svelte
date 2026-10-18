<script lang="ts">
	import FormattedDate from '#lib/components/FormattedDate.svelte';
	import type { Locale } from '#lib/paraglide/runtime.js';
	import type { FanartsResponse, UsersResponse } from '#lib/pocketbase-types.js';
	import { PUBLIC_POCKETBASE_URL } from '#lib/pocketbase/url.js';
	import { m } from '#lib/paraglide/messages.js';
	import type {
		CommentsByFanart,
		FavoriteByFanart
	} from '../../../../routes/[source]/fanart/+page.server';
	import type { Source } from '#lib/components/getSourceSlug.js';

	function getFanartUrl(id: string, image: string): string {
		return `${PUBLIC_POCKETBASE_URL}/api/files/fanarts/${id}/${image}?thumb=300x200f`;
	}
	let {
		fanarts,
		fanartsFavorites,
		language,
		source,
		fanartsComments
	}: {
		fanarts: FanartsResponse<{ author: UsersResponse }>[];
		fanartsFavorites: FavoriteByFanart[];
		language: Locale;
		source: Source;
		fanartsComments: CommentsByFanart[];
	} = $props();

	function getFavs(id: string): number {
		const fa = fanartsFavorites.find((f) => f.fanart == id);
		if (!fa) {
			return 0;
		}
		return fa.favorites.length;
	}
	function getComments(id: string): number {
		const c = fanartsComments.find((f) => f.fanart == id);
		if (!c) {
			return 0;
		}
		return c.comments.length;
	}
</script>

{#if fanarts.length === 0}
	<h2>{m.empty_fanart_gallery()}</h2>
{/if}
<div class="flex flex-wrap gap-2">
	{#each fanarts as fanart}
		<div class="flex flex-col">
			<a href={`/${language}/${source}/fanart/${fanart.id}`}>
				<img
					src={getFanartUrl(fanart.id, fanart.image)}
					alt={m.fanart_g_alt({ title: fanart.title, author: fanart.expand.author.username })}
				/>
			</a>
			<a href={`/${language}/${source}/fanart/${fanart.id}`}>
				<p class="mt-2 text-center">{fanart.title}</p>
			</a>
			<p class="text-center">
				{m.fa_by()}
				<a href={`/${language}/${source}/profile?id=${fanart.author}`}
					>{fanart.expand.author.username}</a
				>
			</p>
			<p class="text-center">
				{getFavs(fanart.id)}
				{m.fa_favs()}
			</p>
			<p class="text-center">
				{getComments(fanart.id)}
				{m.fa_comments_word()}
			</p>
			<p class="mt-2 text-center text-xs italic">
				On <FormattedDate date={new Date(fanart.created)} showTime={false} />
			</p>
		</div>
	{/each}
</div>
