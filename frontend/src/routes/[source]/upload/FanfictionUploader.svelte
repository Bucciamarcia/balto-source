<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import { m } from '$lib/paraglide/messages';

	let files: FileList | undefined = $state();
	let success: boolean = $state(false);
	let filePicked: boolean = $state(false);
	let isLoading: boolean = $state(false);
	let errorMessage: string = $state('');
	$effect(() => {
		const file = files?.[0];
		if (!file) {
			filePicked = false;
		} else {
			filePicked = true;
		}
	});
</script>

<h1>{m.upload_ff_title()}</h1>
<p>{m.upload_ff_descr()}</p>

<form
	method="POST"
	action="?/uploadFanfiction"
	enctype="multipart/form-data"
	use:enhance={() => {
		errorMessage = '';
		isLoading = true;
		success = false;
		return async ({ result, update }) => {
			await update();
			isLoading = false;
			if (result.type === 'failure') {
				errorMessage = (result.data?.error as string) ?? 'Unknown error';
			}
			if (result.type === 'success') {
				success = true;
				files = undefined;
			}
		};
	}}
>
	<div class="mt-5">
		<fieldset class="fieldset">
			<legend class="fieldset-legend text-neutral-content">Title</legend>
			<input
				type="text"
				name="title"
				class="input text-black"
				placeholder={m.upload_ff_ph_title()}
			/>
		</fieldset>
	</div>
	<div class="mt-5">
		<textarea class="textarea text-black" name="description" placeholder={m.upload_ff_ta()}>
		</textarea>
	</div>
	<div>
		<input
			type="file"
			name="fanfiction"
			class="file-input mt-5 file-input-accent text-black"
			accept=".docx"
			bind:files
		/>
	</div>
	{#if isLoading}
		<span class="loading loading-spinner text-primary"></span>
	{:else if filePicked}
		<button class="btn mt-5" type="submit">{m.upload_ff_btn_conf()}</button>
	{/if}
</form>
{#if success}
	<p class="text-xl text-green-600">{m.upload_ff_conf()}</p>
{/if}
{#if errorMessage}
	<FormError message={errorMessage} />
{/if}
