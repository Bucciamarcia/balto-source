<script lang="ts">
	import { enhance } from '$app/forms';
	import ShowComments from '$lib/components/layout/comments/ShowComments.svelte';

	let { data } = $props();
	let fanfiction = $derived(data.fanfiction);
</script>

<svelte:head>
	<title>{data.fanfiction.title} by {data.fanfiction.expand.author.username} - Balto Source</title>
</svelte:head>

<h1 class="text-center">{fanfiction.title}</h1>
<p class="text-center">
	By <a href="/profile/{fanfiction.author}">{fanfiction.expand.author.username}</a>
</p>
<p class="mt-5 mb-10 text-center italic">{fanfiction.description}</p>
{@html fanfiction.content}
<p class="mt-5">{data.favs.length} favorites</p>
{#if data.isLoggedIn}
	{#if data.alreadyFaved}
		<form method="POST" action="?/removeFavorite" use:enhance>
			<button class="btn cursor-pointer btn-primary" type="submit">Remove from favorites</button>
		</form>
	{:else}
		<form method="POST" action="?/favorite" use:enhance>
			<button class="btn cursor-pointer btn-primary" type="submit">Add from favorites</button>
		</form>
	{/if}
	<ShowComments
		isLoggedIn={data.isLoggedIn}
		comments={data.comments}
		targetId={fanfiction.id}
		isVerified={data.isVerified}
	/>
{/if}
