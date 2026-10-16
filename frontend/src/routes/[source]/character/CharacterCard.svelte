<script lang="ts">
	import FormattedDate from '#lib/components/FormattedDate.svelte';
	import type { Source } from '#lib/components/getSourceSlug.js';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import type { CharactersResponse, UsersResponse } from '#lib/pocketbase-types.js';
	import { PUBLIC_POCKETBASE_URL } from '#lib/pocketbase/url.js';

	let {
		character,
		favs,
		source
	}: {
		character: CharactersResponse<{ owner: UsersResponse }>;
		favs: string[];
		source: Source;
	} = $props();
	const language = getLocale();

	function getImage() {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${character.id}/${character.profile_picture}?thumb=300x200f`;
	}
</script>

<div class="flex flex-col">
	<a href={`/${language}/${source}/character/${character.id}`}>
		<img
			src={getImage()}
			alt={m.ch_title_by({ name: character.name, owner: character.expand.owner.username })}
		/>
	</a>
	<a href={`/${language}/${source}/character/${character.id}`}>
		<p class="mt-2 text-center">{character.name}</p>
	</a>
	<p class="text-center">
		{m.fa_by()}
		<a href={`/${language}/${source}/profile?id=${character.owner}`}
			>{character.expand.owner.username}</a
		>
	</p>
	<p class="text-center">
		{favs.length}
		{m.ch_favs()}
	</p>
	<p class="mt-2 text-center text-xs italic">
		On <FormattedDate date={new Date(character.created)} showTime={false} />
	</p>
</div>
