<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';

	let { action = '?/default' }: { action?: string } = $props();
	let isLoading: boolean = $state(false);
</script>

<p class="mb-3 text-xl">{m.fa_s_search()}</p>
<form
	class="mb-5"
	method="POST"
	{action}
	use:enhance={() => {
		isLoading = true;
		return async ({ update }) => {
			await update();
			isLoading = false;
		};
	}}
>
	<input type="text" name="filter" class="input text-black" placeholder={m.fa_search_bloop()} />
	{#if isLoading}
		<span class="loading loading-sm loading-spinner"></span>
	{:else}
		<button type="submit" class="btn btn-primary">{m.fa_dunno()}</button>
		<button type="submit" formaction="?/clear" class="btn btn-error">{m.fa_s_clear()}</button>
	{/if}
</form>
