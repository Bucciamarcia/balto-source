<script lang="ts">
	import { enhance } from '$app/forms';
	import ConfirmationSnackbar from '$lib/components/layout/confirmation-snackbar.svelte';
	import type { PageData } from './$types';
	import SingleNews from './SingleNews.svelte';

	let { data }: { data: PageData } = $props();
</script>

<head>
	<title>Balto Source - Reach For The Light</title>
</head>

<div class="mainManu">
	<h1>Balto Source: We are so back!!!!!</h1>
	<br />
	<br />
	<p><a href="/signup">sign up</a></p>
	<p><a href="/login">login</a></p>
	<p><a href="/chat">chat</a></p>
</div>

{#each data.resultList as news}
	<SingleNews {news} />
{/each}

<form method="POST" action="?/logout" use:enhance>
	<button type="submit">Logout</button>
</form>

{#if data.flash}
	<ConfirmationSnackbar message={data.flash} />
{/if}
