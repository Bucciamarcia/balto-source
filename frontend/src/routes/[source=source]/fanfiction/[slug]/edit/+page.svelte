<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import { m } from '$lib/paraglide/messages';

	let { data } = $props();
	let title = $derived(data.fanfiction.title);
	let description = $derived(data.fanfiction.description);
	let errorMessage = $state('');
</script>

<svelte:head><title>{m.ff_edit_title({ title: data.fanfiction.title })}</title></svelte:head>

<h1 class="text-center">{m.ff_edit_head({ title: data.fanfiction.title })}</h1>
<form
	method="POST"
	use:enhance={() => {
		errorMessage = '';
		return async ({ result, update }) => {
			await update();

			if (result.type === 'failure') {
				console.log(result.data);
				errorMessage = (result.data?.error as string) ?? 'Unknown error';
			}
		};
	}}
	class="flex flex-col items-center"
	enctype="multipart/form-data"
>
	<fieldset class="fieldset">
		<legend class="fieldset-legend text-white">Title</legend>
		<input
			type="text"
			class="input text-black"
			name="title"
			placeholder="Insert the new title here"
			bind:value={title}
		/>
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend text-white">Description</legend>
		<input
			type="text"
			class="input text-black"
			name="description"
			placeholder="Insert new description here"
			bind:value={description}
		/>
		<input
			type="file"
			name="fanfiction"
			class="file-input mt-5 file-input-accent text-black"
			accept=".docx"
		/>
	</fieldset>
	<div class="mt-4 flex gap-3">
		<button class="btn" type="submit" formaction="?/cancel">{m.ff_edit_cta_cancel()}</button>
		<button class="btn btn-error" type="submit" formaction="?/remove"
			>{m.ff_edit_cta_remove()}</button
		>
		<button class="btn btn-primary" type="submit" formaction="?/edit">{m.ff_edit_cta_page()}</button
		>
	</div>
</form>
{#if errorMessage !== ''}
	<FormError message={errorMessage} />
{/if}
