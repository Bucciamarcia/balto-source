<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import { FANART_TOO_LARGE_MESSAGE, MAX_FANART_BYTES } from '$lib/limits';
	import { m } from '$lib/paraglide/messages';
	let files: FileList | undefined = $state();
	let previewUrl: string | null = $state(null);
	let errorMessage: string = $state('');
	let success: boolean = $state(false);
	let isLoading: boolean = $state(false);

	let tooLarge = $derived((files?.[0]?.size ?? 0) > MAX_FANART_BYTES);

	$effect(() => {
		const file = files?.[0];
		if (!file || file.size > MAX_FANART_BYTES) {
			previewUrl = null;
			return;
		}
		const url = URL.createObjectURL(file);
		previewUrl = url;
		return () => URL.revokeObjectURL(url);
	});
</script>

<h1 class="mb-5">{m.upload_fa_title()}</h1>
<form
	method="POST"
	action="?/uploadFanart"
	enctype="multipart/form-data"
	use:enhance={() => {
		errorMessage = '';
		success = false;
		isLoading = true;
		return async ({ result, update }) => {
			await update();
			isLoading = false;
			if (result.type === 'failure') {
				console.log('failure');
				console.log(result.data?.error);
				errorMessage = (result.data?.error as string) ?? 'Unknown error';
			} else if (result.type === 'success') {
				success = true;
				files = undefined;
			}
		};
	}}
>
	<input
		type="file"
		name="fanart"
		class="file-input file-input-accent text-black"
		accept=".png, .jpg, .jpeg"
		bind:files
	/>
	{#if tooLarge}
		<FormError message={FANART_TOO_LARGE_MESSAGE} />
	{/if}
	{#if previewUrl}
		<img class="mt-5" src={previewUrl} alt={m.preview_fa()} />
		<div>
			<fieldset class="fieldset">
				<legend class="fieldset-legend text-xl text-white">{m.upload_fa_title_button()}</legend>
				<input type="text" name="title" class="input text-black" placeholder={m.upload_fa_ph()} />
			</fieldset>
		</div>
		<div>
			<textarea class="textarea text-black" placeholder={m.upload_fa_desc()} name={m.upload_fa_dn()}
			></textarea>
		</div>
		<div>
			{#if isLoading}
				<span class="loading loading-spinner text-primary"></span>
			{:else}
				<button class="btn mt-5" type="submit">{m.upload_fa_btn_blue()}</button>
			{/if}
		</div>
	{/if}
</form>
{#if errorMessage}
	<FormError message={errorMessage} />
{/if}
{#if success}
	<p class="text-xl text-green-600">{m.upload_fa_success()}</p>
{/if}
