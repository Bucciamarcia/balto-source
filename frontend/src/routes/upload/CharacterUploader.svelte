<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { CharacterSex } from './+page.server';
	let characterSex: CharacterSex = $state('male');
	let error: string = $state('');
	let isLoading: boolean = $state(false);
	let showSuccess: boolean = $state(false);
	let files: FileList | undefined = $state();
</script>

<h1>{m.upload_character_h()}</h1>
<form
	method="POST"
	enctype="multipart/form-data"
	action="?/createCharacter"
	use:enhance={() => {
		error = '';
		isLoading = true;
		showSuccess = false;
		return async ({ result, update }) => {
			await update();
			isLoading = false;
			if (result.type === 'failure') {
				error = (result.data?.error as string) ?? 'Unknown error';
			} else if (result.type === 'success') {
				showSuccess = true;
			}
			characterSex = 'male';
		};
	}}
>
	<fieldset class="fieldset">
		<legend class="fieldset-legend text-white">{m.upload_ch_name()}</legend>
		<input type="text" name="name" class="input text-black" placeholder={m.upload_ch_de()} />
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend text-white">{m.upload_ch_pp_n()}</legend>
		<input type="file" name="avatar" class="file-input text-black" bind:files />
		<label class="label" for="avatar">{m.upload_ch_max()}</label>
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend text-white">{m.upload_ch_ref_n()}</legend>
		<input type="file" name="ref" class="file-input text-black" />
		<label class="label" for="file">{m.upload_ch_ref_max()}</label>
	</fieldset>
	<p class="fieldset-legend text-white">{m.upload_ch_sex()}</p>
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
	<textarea class="textarea mt-5 text-black" placeholder={m.upload_character_bio()} name="bio"
	></textarea>
	<div>
		{#if isLoading}
			<span class="loading loading-md loading-spinner"></span>
		{:else}
			<button type="submit" class="btn mt-5 btn-primary">Create this character</button>
		{/if}
	</div>
</form>
{#if showSuccess === true}
	<p class="text-green-600">{m.upload_character_ok()}</p>
{/if}
{#if error !== ''}
	<FormError message={error} />
{/if}
