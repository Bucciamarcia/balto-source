<script lang="ts">
	import ConfirmationSnackbar from '$lib/components/layout/confirmation-snackbar.svelte';
	import type { PageData } from './$types';
	import SingleNews from './SingleNews.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Balto Source - Reach For The Light</title>
</svelte:head>

<div>
	<h1>Balto Source: We are so back!!!!!</h1>
</div>

{#each data.resultList as news}
	<SingleNews {news} comments={data.loadedComments.get(news.id)!} showCommentsLine={true} />
{/each}

{#if data.flash}
	<ConfirmationSnackbar message={data.flash} />
{/if}
