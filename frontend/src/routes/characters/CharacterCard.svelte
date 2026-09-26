<script lang="ts">
	import FormattedDate from '$lib/components/FormattedDate.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import type { CharactersResponse, UsersResponse } from '$lib/pocketbase-types';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';

	let {
		character,
		favs
	}: {
		character: CharactersResponse<{ owner: UsersResponse }>;
		favs: string[];
	} = $props();
	const language = getLocale();

	function getImage() {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${character.id}/${character.profile_picture}?thumb=300x200f`;
	}
</script>

<div class="flex flex-col">
	<a href={`/${language}/character/${character.id}`}>
		<img
			src={getImage()}
			alt={m.ch_title_by({ name: character.name, owner: character.expand.owner.username })}
		/>
	</a>
	<a href={`/${language}/character/${character.id}`}>
		<p class="mt-2 text-center">{character.name}</p>
	</a>
	<p class="text-center">
		{m.fa_by()}
		<a href={`/${language}/profile?id=${character.owner}`}>{character.expand.owner.username}</a>
	</p>
	<p class="text-center">
		{favs.length}
		{m.ch_favs()}
	</p>
	<p class="mt-2 text-center text-xs italic">
		On <FormattedDate date={new Date(character.created)} showTime={false} />
	</p>
</div>
