<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';
	import MaleIcon from './MaleIcon.svelte';

	let { data } = $props();

	function getAvatarThumb() {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${data.character.id}/${data.character.profile_picture}?thumb=300x200f`;
	}
	function getAvatarFull() {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${data.character.id}/${data.character.profile_picture}`;
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
	<div class="center self-center inline-5">
		<MaleIcon />
	</div>
</div>
<a href={getAvatarFull()} target="_blank">
	<img
		class="mx-auto"
		src={getAvatarThumb()}
		alt={m.ch_avatar_alt({ name: data.character.name })}
	/>
</a>
