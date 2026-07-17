<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import type { UsersResponse } from '$lib/pocketbase-types';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';

	let { data } = $props();
	// svelte-ignore state_referenced_locally
	const author: UsersResponse = data.fanart.expand.author;
	let isExpanded: boolean = $state(false);
	let errorMessage: string = $state('');
	let isLoggedIn: boolean = $derived(data.user != null);
	function getFanartUrl(id: string, image: string): string {
		const root = `${PUBLIC_POCKETBASE_URL}/api/files/fanarts/${id}/${image}`;
		if (isExpanded) return root;
		return `${root}?thumb=1000x0`;
	}
</script>

<div class="mainbg flex flex-col">
	<div class="self-center p-4">
		<img
			src={getFanartUrl(data.fanart.id, data.fanart.image)}
			alt={`${data.fanart.title} by ${author.username}`}
		/>
		<button
			class="mt-3 cursor-pointer underline"
			type="button"
			onclick={() => {
				isExpanded = !isExpanded;
			}}
		>
			{isExpanded ? 'Show thumbnail' : 'Show full size'}
		</button>
		<p>{data.favs.length} favorites</p>
		{#if isLoggedIn}
			{#if data.alreadyFaved}
				<form
					method="POST"
					action="?/removeFavorite"
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
				>
					<button type="submit" class="btn btn-primary">Remove from favorites</button>
					{#if errorMessage != ''}
						<FormError message={errorMessage} />
					{/if}
				</form>
			{:else}
				<form
					method="POST"
					action="?/favorite"
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
				>
					<button type="submit" class="btn btn-primary">Add to favorites</button>
					{#if errorMessage != ''}
						<FormError message={errorMessage} />
					{/if}
				</form>
			{/if}
		{/if}
	</div>
</div>
