<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '#lib/paraglide/messages.js';
	let {
		selectedCharacters = $bindable([]),
		source
	}: { selectedCharacters: CharactersResponse<{ owner: UsersResponse }>[]; source: string } =
		$props();
	import { localizeHref } from '#lib/paraglide/runtime.js';
	import type { CharactersResponse, UsersResponse } from '#lib/pocketbase-types.js';
	import { PUBLIC_POCKETBASE_URL } from '#lib/pocketbase/url.js';
	let searchResult: CharactersResponse<{ owner: UsersResponse }>[] = $state([]);
	let errorMessage: string = $state('');
	let isLoading: boolean = $state(false);

	function addCharacter(c: CharactersResponse<{ owner: UsersResponse }>) {
		if (!selectedCharacters.some((sc) => sc.id === c.id)) {
			selectedCharacters.push(c);
		}
	}
	function removeCharacter(c: CharactersResponse<{ owner: UsersResponse }>) {
		selectedCharacters = selectedCharacters.filter((cc) => cc.id !== c.id);
	}
	function getImage(character: CharactersResponse<{ owner: UsersResponse }>) {
		return `${PUBLIC_POCKETBASE_URL}/api/files/characters/${character.id}/${character.profile_picture}?thumb=300x200f`;
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
	<div class="mt-5 mb-5 flex flex-wrap gap-2">
		{#each searchResult as character}
			<div class="flex flex-col gap-2">
				<img
					src={getImage(character)}
					alt={m.ch_alt_result({ name: character.name, author: character.expand.owner.username })}
				/>
				<button
					type="button"
					onclick={() => {
						addCharacter(character);
					}}
					class="btn btn-primary">{m.ch_add_btn_fanart()}</button
				>
			</div>
		{/each}
	</div>
{/if}
{#if selectedCharacters.length > 0}
	<div class="flex gap-1">
		{#each selectedCharacters as selected}
			<div class="badge badge-primary">
				<div>{selected.name}</div>
				<div>
					<button
						type="button"
						class="cursor-pointer"
						onclick={() => {
							removeCharacter(selected);
						}}>X</button
					>
				</div>
			</div>
		{/each}
	</div>
{/if}
