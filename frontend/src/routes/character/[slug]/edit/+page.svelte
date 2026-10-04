<script lang="ts">
	import { enhance } from '$app/forms';
	import TipTapEditor from '$lib/components/layout/comments/TipTapEditor.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { CharacterSex } from '../../../upload/proxy+page.server';
	let { data } = $props();
	let characterSex: CharacterSex = $derived(data.character.sex);
	let bio = $derived(data.character.bio);
	let isLoading: boolean = $state(false);
</script>

<svelte:head><title>{m.ch_edit_head({ character: data.character.name })}</title></svelte:head>
<h1 class="text-center">{m.ch_edit_h1({ character: data.character.name })}</h1>
<h2 class="text-center">{m.ch_edit_avatar_head()}</h2>
<p class="text-center">{m.ch_edit_avatar_desc()}</p>
<form method="POST" use:enhance enctype="multipart/form-data" class="flex flex-col items-center">
	<input type="file" class="file-input mt-5 self-center text-black" name="avatar" />
	<h2 class="text-center">{m.ch_edit_ref()}</h2>
	<p class="text-center">{m.ch_edit_ref_desc()}</p>
	<input type="file" class="file-input mt-5 self-center text-black" name="ref_sheet" />
	<h2 class="text-center">{m.ch_edit_sex()}</h2>
	<div class="flex items-center">
		<input
			type="radio"
			name="sex"
			value="male"
			class="radio mr-2 radio-primary"
			checked={characterSex === 'male'}
			bind:group={characterSex}
		/>
		<p class="text-white">{m.upload_ch_sex_m()}</p>
	</div>
	<div class="flex items-center">
		<input
			type="radio"
			name="sex"
			value="female"
			class="radio mr-2 radio-primary"
			checked={characterSex === 'female'}
			bind:group={characterSex}
		/>
		<p class="text-white">{m.upload_ch_sex_f()}</p>
	</div>
	<div class="flex items-center">
		<input
			type="radio"
			name="sex"
			value="other"
			class="radio mr-2 radio-primary"
			checked={characterSex === 'other'}
			bind:group={characterSex}
		/>
		<p class="text-white">{m.upload_ch_sex_o()}</p>
	</div>
	<h2>{m.ch_edit_bio()}</h2>
	<TipTapEditor header={m.ch_edit_tiptap()} content={data.character.bio} bind:value={bio} />
	<input type="hidden" name="bio" bind:value={bio} />
	{#if isLoading}
		<span class="loading loading-spinner text-primary"></span>
	{:else}
		<div class="flex gap-4">
			<button class="btn" type="submit" formaction="?/cancel">{m.ch_edit_cancel()}</button>
			<button class="btn btn-error" type="submit" formaction="?/remove">{m.ch_edit_remove()}</button
			>
			<button class="btn btn-primary" type="submit" formaction="?/edit"
				>{m.ch_edit_confirm_btn()}</button
			>
		</div>
	{/if}
</form>
