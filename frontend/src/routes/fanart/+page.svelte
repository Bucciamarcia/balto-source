<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';
	import type { PageData } from './$types';
	import FormattedDate from '$lib/components/FormattedDate.svelte';

	let { data }: { data: PageData } = $props();

	function getFanartUrl(id: string, image: string): string {
		return `${PUBLIC_POCKETBASE_URL}/api/files/fanarts/${id}/${image}?thumb=300x200f`;
	}
</script>

<div class="flex flex-wrap gap-2">
	{#each data.fanarts as fanart}
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
			<p class="mt-2 text-center text-xs italic">
				On <FormattedDate date={new Date(fanart.created)} showTime={false} />
			</p>
		</div>
	{/each}
</div>
