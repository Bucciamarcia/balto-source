<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import { m } from '$lib/paraglide/messages';

	let { data } = $props();
	let error: string = $state('');
</script>

<svelte:head><title>{m.ch_remove_title({ name: data.character.name })}</title></svelte:head>
<h1 class="text-center">{m.ch_remove_h1_conf({ name: data.character.name })}</h1>
<p class="text-center">{m.ch_remove_text()}</p>
<div class="mt-4 flex items-center justify-center gap-4">
	<form
		method="POST"
		use:enhance={() => {
			error = '';
			return async ({ result, update }) => {
				await update();

				if (result.type === 'failure') {
					error = (result.data?.error as string) ?? 'Unknown error occurred';
				}
			};
		}}
	>
		<button class="btn" type="submit" formaction="?/cancel">{m.ch_remove_btn_cancel()}</button>
		<button class="btn btn-error" type="submit" formaction="?/remove"
			>{m.ch_remove_btn_confirm()}</button
		>
	</form>
	{#if error !== ''}
		<FormError message={error} />
	{/if}
</div>
