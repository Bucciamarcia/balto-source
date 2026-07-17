<script lang="ts">
	import type { UsersResponse } from '$lib/pocketbase-types';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';

	let { data } = $props();
	// svelte-ignore state_referenced_locally
	const author: UsersResponse = data.fanart.expand.author;
	let isExpanded: boolean = $state(false);
	function getFanartUrl(id: string, image: string): string {
		const root = `${PUBLIC_POCKETBASE_URL}/api/files/fanarts/${id}/${image}`;
		if (isExpanded) return root;
		return `${root}?thumb=1000x0`;
	}
</script>

<div class="mainbg flex flex-col">
	<div class="self-center p-4">
		<img
			src={getFanartUrl(data.fanart.id, data.fanart.image)}
			alt={`${data.fanart.title} by ${author.username}`}
		/>
		<button
			class="mt-3 cursor-pointer underline"
			type="button"
			onclick={() => {
				isExpanded = !isExpanded;
			}}
		>
			{isExpanded ? 'Show thumbnail' : 'Show full size'}
		</button>
		<p>{data.favs.length} favorites</p>
		<form method="POST" action="?/favorite">
			<button type="submit">gogo</button>
		</form>
	</div>
</div>
