<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { PageProps } from './$types';
	import CharacterCard from './CharacterCard.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{m.ch_head()}</title>
</svelte:head>
<h1>{m.ch_h1()}</h1>

<div class="flex flex-wrap gap-2">
	{#each data.characters as character}
		<CharacterCard {character} favs={data.favorites.get(character.id) ?? []} />
	{/each}
</div>
