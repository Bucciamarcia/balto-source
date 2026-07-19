<script lang="ts">
	import FanartGallery from '$lib/components/layout/fanarts/FanartGallery.svelte';
	import HomeProfile from './HomeProfile.svelte';

	let { data } = $props();
	let selectedTab: string = $state('home');
	function pickColor(v: string): string {
		if (v === selectedTab) return 'btn-accent';
		return 'btn-primary';
	}
</script>

<svelte:head>
	<title>{data.user.username}'s profile - Balto Source</title>
</svelte:head>
<div class="mb-5 flex w-full justify-center gap-3">
	<button
		class={`btn ${pickColor('home')}`}
		onclick={() => {
			selectedTab = 'home';
		}}>Home</button
	>
	{#if data.fanarts.length !== 0}
		<button
			class={`btn ${pickColor('gallery')}`}
			onclick={() => {
				selectedTab = 'gallery';
			}}>Gallery</button
		>
	{/if}
</div>

{#if selectedTab === 'home'}
	<HomeProfile
		user={data.user}
		isLoggedIn={data.isLoggedIn}
		isSelf={data.isSelf}
		comments={data.comments}
	/>
{/if}
{#if selectedTab === 'gallery'}
	<FanartGallery fanarts={data.fanarts} />
{/if}
