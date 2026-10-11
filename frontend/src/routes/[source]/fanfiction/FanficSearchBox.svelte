<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';

	let { action = '?/default' }: { action?: string } = $props();
	let isLoading: boolean = $state(false);
</script>

<p class="mb-3 text-xl">{m.ff_src()}</p>
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
	<input type="text" name="filter" class="input text-black" placeholder={m.ff_s_place()} />
	{#if isLoading}
		<span class="loading loading-sm loading-spinner"></span>
	{:else}
		<button type="submit" class="btn btn-primary">{m.ff_bbb()}</button>
		<button type="submit" formaction="?/clear" class="btn btn-error">{m.ff_s_clear()}</button>
	{/if}
</form>
