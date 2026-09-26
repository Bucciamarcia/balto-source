<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';
	import SexIcon from './SexIcon.svelte';

	let { data } = $props();

	let favIds = $derived(data.favs.map((f) => f.id));

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
	function hasFaved(): boolean {
		return favIds.includes(data.user?.id ?? 'No user');
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
<a href={getAvatarFull()} target="_blank">
	<img
		class="mx-auto"
		src={getAvatarThumb()}
		alt={m.ch_avatar_alt({ name: data.character.name })}
	/>
</a>
<div class="flex place-content-center">
	<h1 class="mr-3 mb-1 text-center">{data.character.name}</h1>
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
<a href={getRefFull()} target="_blank">
	<img class="mx-auto" src={getRefThumb()} alt={m.ch_ref_alt({ name: data.character.name })} />
</a>
<p class="text-center">{m.ch_favs_page({ favs: data.favs.length })}</p>
<div class="mt-3 place-self-center">
	{#if hasFaved()}
		<form method="POST" action="?/removeFromFavorites" use:enhance>
			<button class="btn btn-primary"> Remove from favorites</button>
		</form>
	{:else}
		<form method="POST" action="?/addToFavorites" use:enhance>
			<button class="btn btn-primary"> Add to favorites</button>
		</form>
	{/if}
</div>
<div
	class="width mx-auto mt-5 w-244 border-1 border-solid border-primary bg-neutral bg-white/3 p-5"
>
	{@html data.character.bio}
</div>
