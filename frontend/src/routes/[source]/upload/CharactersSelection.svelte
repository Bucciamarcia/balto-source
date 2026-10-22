<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '#lib/paraglide/messages.js';
	let { characters = $bindable([]), source }: { characters: string[]; source: string } = $props();
	import { localizeHref } from '#lib/paraglide/runtime.js';
	import type { CharactersResponse, UsersResponse } from '#lib/pocketbase-types.js';
	let searchResult: CharactersResponse<{ owner: UsersResponse }>[] = $state([]);
	let errorMessage: string = $state('');
	let isLoading: boolean = $state(false);

	function addCharacter(c: string) {
		characters.push(c);
	}
</script>

<div>
	<form
		method="POST"
		action={localizeHref(`/${source}/character?/searchByName`)}
		class="flex gap-2 text-black"
		use:enhance={() => {
			searchResult = [];
			errorMessage = '';
			isLoading = true;
			return async ({ result, update }) => {
				await update({ navigate: false });
				isLoading = false;
				if (result.type === 'failure') {
					errorMessage = result.data?.error as string;
				}
				if (result.type === 'success') {
					searchResult = (result.data?.characters ?? []) as CharactersResponse<{
						owner: UsersResponse;
					}>[];
				}
			};
		}}
	>
		<input type="text" placeholder={m.ch_select_plant()} name="name" class="input" />
		<div>
			{#if isLoading}
				<span class="loading loading-sm loading-spinner text-primary"></span>
			{:else}
				<button type="submit" class="btn btn-primary">Search</button>
			{/if}
		</div>
	</form>
</div>
{#if searchResult.length > 0}
	<div class="flex flex-wrap gap-2">
		{#each searchResult as character}
			<p>{character.name}</p>
		{/each}
	</div>
{/if}
