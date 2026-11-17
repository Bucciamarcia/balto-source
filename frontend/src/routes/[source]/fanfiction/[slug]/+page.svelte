<script lang="ts">
	import { enhance } from '$app/forms';
	import { canModerate } from '#lib/components/canModerate.js';
	import ShowComments from '#lib/components/layout/comments/ShowComments.svelte';
	import { m } from '#lib/paraglide/messages.js';
	import UsersList from '#lib/components/layout/head-menu/UsersList.svelte';
	import CharacterBox from '#lib/components/layout/characters/CharacterBox.svelte';

	let { data } = $props();
	let fanfiction = $derived(data.fanfiction);
	let showModal: boolean = $state(false);
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
{#if data.fanfiction.author === data.user?.id || canModerate(data.user)}
	<div class="flex justify-center">
		<a
			href="/{data.language}/{data.source}/fanfiction/{fanfiction.id}/edit"
			class="btn no-underline btn-primary">{m.ff_edit_main_button()}</a
		>
	</div>
{/if}
<p class="text-center">
	{m.ff_by()}
	<a href="/{data.language}/{data.source}/profile?id={fanfiction.author}">
		{fanfiction.expand.author.username}
	</a>
</p>
<p class="mt-5 mb-10 text-center italic">{fanfiction.description}</p>
{@html fanfiction.content}
<button class="mx-auto block cursor-pointer" onclick={() => (showModal = true)}>
	<p class="mt-5 underline">{data.favs.length} {m.ff_favs()}</p>
</button>
<UsersList
	bind:open={showModal}
	title={m.ff_favd_pop()}
	userFavs={data.userFavs}
	source={data.source}
/>
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
	<h2>{m.ch_in_ff()}</h2>
	<div class="flex flex-row gap-4">
		{#each fanfiction.expand.characters as character}
			<CharacterBox {character} source={data.source} />
		{/each}
	</div>
	<ShowComments
		isLoggedIn={data.isLoggedIn}
		comments={data.comments}
		targetId={fanfiction.id}
		isVerified={data.isVerified}
		language={data.language}
		source={data.source}
	/>
{/if}
