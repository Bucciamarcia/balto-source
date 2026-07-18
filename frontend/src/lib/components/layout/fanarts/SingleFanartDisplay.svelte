<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import ShowComments from '$lib/components/layout/comments/ShowComments.svelte';
	import type {
		CommentsResponse,
		FanartFavoritesResponse,
		FanartsResponse,
		UsersResponse
	} from '$lib/pocketbase-types';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';
	import type { AuthRecord } from 'pocketbase';

	let {
		fanart,
		user,
		favs,
		alreadyFaved,
		comments
	}: {
		fanart: FanartsResponse<{ author: UsersResponse }>;
		user: AuthRecord;
		favs: FanartFavoritesResponse[];
		alreadyFaved: boolean;
		comments: CommentsResponse<{ author: UsersResponse }>[];
	} = $props();
	// svelte-ignore state_referenced_locally
	const author: UsersResponse = fanart.expand.author;
	let isExpanded: boolean = $state(false);
	let errorMessage: string = $state('');
	let isLoggedIn: boolean = $derived(user != null);
	function getFanartUrl(id: string, image: string): string {
		const root = `${PUBLIC_POCKETBASE_URL}/api/files/fanarts/${id}/${image}`;
		if (isExpanded) return root;
		return `${root}?thumb=1000x0`;
	}
</script>

<div class="flex flex-col">
	<div class="self-center p-4">
		<div>
			<h1 class="mb-3 text-center">{fanart.title}</h1>
		</div>
		<div>
			<img
				class="mb-3"
				src={getFanartUrl(fanart.id, fanart.image)}
				alt={`${fanart.title} by ${author.username}`}
			/>
		</div>
		<button
			class="mt-3 cursor-pointer underline"
			type="button"
			onclick={() => {
				isExpanded = !isExpanded;
			}}
		>
			{isExpanded ? 'Show thumbnail' : 'Show full size'}
		</button>
		<div>
			{@html fanart.description}
		</div>
		<p>{favs.length} favorites</p>
		{#if isLoggedIn}
			{#if alreadyFaved}
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
		<ShowComments {isLoggedIn} targetId={fanart.id} {comments} />
	</div>
</div>
