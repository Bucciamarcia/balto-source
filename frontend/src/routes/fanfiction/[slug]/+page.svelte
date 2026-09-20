<script lang="ts">
	import { enhance } from '$app/forms';
	import ShowComments from '$lib/components/layout/comments/ShowComments.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
	let fanfiction = $derived(data.fanfiction);
</script>

<svelte:head>
	<title>
		{m.ff_tit({
			title: data.fanfiction.title,
			author: data.fanfiction.expand.author.username
		})}
	</title>
</svelte:head>

<h1 class="text-center">{fanfiction.title}</h1>
<p class="text-center">
	{m.ff_by()}
	<a href="/{data.language}/profile?id={fanfiction.author}">
		{fanfiction.expand.author.username}
	</a>
</p>
<p class="mt-5 mb-10 text-center italic">{fanfiction.description}</p>
{@html fanfiction.content}
<p class="mt-5">{data.favs.length} {m.ff_favs()}</p>
{#if data.isLoggedIn}
	{#if data.alreadyFaved}
		<form method="POST" action="?/removeFavorite" use:enhance>
			<button class="btn cursor-pointer btn-primary" type="submit">{m.ff_unfav()}</button>
		</form>
	{:else}
		<form method="POST" action="?/favorite" use:enhance>
			<button class="btn cursor-pointer btn-primary" type="submit">{m.ff_fav()}</button>
		</form>
	{/if}
	<ShowComments
		isLoggedIn={data.isLoggedIn}
		comments={data.comments}
		targetId={fanfiction.id}
		isVerified={data.isVerified}
		language={data.language}
	/>
{/if}
