<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';
	import SexIcon from './SexIcon.svelte';

	let { data } = $props();

	function getAvatarThumb() {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${data.character.id}/${data.character.profile_picture}?thumb=300x200f`;
	}
	function getAvatarFull() {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${data.character.id}/${data.character.profile_picture}`;
	}
	function getRefThumb() {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${data.character.id}/${data.character.ref_sheet}?thumb=300x200f`;
	}
	function getRefFull() {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${data.character.id}/${data.character.ref_sheet}`;
	}
</script>

<svelte:head>
	<title>
		{m.ch_single_title({
			name: data.character.name,
			owner: data.character.expand.owner.username
		})}
	</title>
</svelte:head>
<div class="flex place-content-center">
	<h1 class="mr-3 text-center">{data.character.name}</h1>
	{#if data.character.sex !== 'other'}
		<div class="center self-center inline-5">
			<SexIcon sex={data.character.sex} />
		</div>
	{/if}
</div>
<p class="mb-5 text-center">
	{@html m.ch_page_by_line({
		username: data.character.expand.owner.username,
		lang: getLocale(),
		userId: data.character.owner
	})}
</p>
<a href={getAvatarFull()} target="_blank">
	<img
		class="mx-auto"
		src={getAvatarThumb()}
		alt={m.ch_avatar_alt({ name: data.character.name })}
	/>
</a>
<h2 class="text-center">{m.ch_ref_text()}</h2>
<a href={getRefFull()} target="_blank">
	<img class="mx-auto" src={getRefThumb()} alt={m.ch_ref_alt({ name: data.character.name })} />
</a>
