<script lang="ts">
	import { type Source } from '#lib/components/getSourceSlug.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import type { CharactersResponse } from '#lib/pocketbase-types.js';
	import { PUBLIC_POCKETBASE_URL } from '#lib/pocketbase/url.js';

	let { character, source }: { character: CharactersResponse; source: Source } = $props();
	function getImage(character: CharactersResponse): string {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${character.id}/${character.profile_picture}?thumb=300x200f`;
	}
	function getCharacterPage(): string {
		return `/${getLocale()}/${source}/character/${character.id}`;
	}
</script>

<div class="flex flex-col">
	<a href={getCharacterPage()}>
		<img src={getImage(character)} alt={character.name} />
	</a>
	<p class="text-center"><a href={getCharacterPage()}> {character.name}</a></p>
</div>
