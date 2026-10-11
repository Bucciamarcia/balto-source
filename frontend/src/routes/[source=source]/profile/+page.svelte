<script lang="ts">
	import FanartGallery from '$lib/components/layout/fanarts/FanartGallery.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import HomeProfile from './HomeProfile.svelte';

	let { data } = $props();
	let selectedTab: string = $state('home');
	function pickColor(v: string): string {
		if (v === selectedTab) return 'btn-accent';
		return 'btn-primary';
	}
</script>

<svelte:head>
	<title>{m.prof_title({ name: data.user.username })}</title>
</svelte:head>
<div class="mb-5 flex w-full justify-center gap-3">
	<button
		class={`btn ${pickColor('home')}`}
		onclick={() => {
			selectedTab = 'home';
		}}
	>
		{m.prof_home()}
	</button>
	{#if data.fanarts.length !== 0}
		<button
			class={`btn ${pickColor('gallery')}`}
			onclick={() => {
				selectedTab = 'gallery';
			}}
		>
			{m.prof_gallery()}
		</button>
	{/if}
</div>

{#if selectedTab === 'home'}
	<HomeProfile
		user={data.user}
		isLoggedIn={data.isLoggedIn}
		isSelf={data.isSelf}
		comments={data.comments}
		isVerified={data.isVerified}
		language={data.language}
	/>
{/if}
{#if selectedTab === 'gallery'}
	<FanartGallery
		fanarts={data.fanarts}
		fanartsFavorites={data.fanartFavorites}
		language={data.language}
	/>
{/if}
