<script lang="ts">
	import ConfirmationSnackbar from '$lib/components/layout/confirmation-snackbar.svelte';
	import type { PageData } from './$types';
	import SingleNews from './SingleNews.svelte';
	import { m } from '$lib/paraglide/messages';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{m.home_title()}</title>
</svelte:head>

{#if data.user?.role === 'admin'}
	<div class="flex">
		<form method="POST" action="?/impersonateUser">
			<input type="text" placeholder="superuser email" name="email" class="input text-black" />
			<input
				type="password"
				placeholder="superuser password"
				name="password"
				class="input text-black"
			/>
			<input type="text" placeholder="UserId to impersonate" name="uid" class="input text-black" />
			<button type="submit">GOGO</button>
		</form>
	</div>
{/if}

<div>
	<h1>{m.home_message()}</h1>
</div>

{#each data.resultList as news}
	<SingleNews
		{news}
		comments={data.loadedComments.get(news.id)!}
		showCommentsLine={true}
		language={data.language}
	/>
{/each}

{#if data.flash}
	<ConfirmationSnackbar message={data.flash} />
{/if}
