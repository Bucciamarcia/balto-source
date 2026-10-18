<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import type { PageProps } from './$types';
	import CharacterCard from './CharacterCard.svelte';

	let { data }: PageProps = $props();

	function getCommentNumber(characterId: string): number {
		const comments = data.comments;
		const c = comments.find((char) => char.character === characterId);
		if (c == undefined) {
			return 0;
		}
		return c.comments.length;
	}
</script>

<svelte:head>
	<title>{m.ch_head()}</title>
</svelte:head>
<h1>{m.ch_h1()}</h1>

<div class="flex flex-wrap gap-2">
	{#each data.characters as character}
		<CharacterCard
			{character}
			favs={data.favorites.get(character.id) ?? []}
			source={data.source}
			comments={getCommentNumber(character.id)}
		/>
	{/each}
</div>
