<script lang="ts">
	import HomeProfile from './HomeProfile.svelte';

	let { data } = $props();
	let selectedTab: string = $state('home');
</script>

<div class="flex w-full justify-center">
	<button class="btn btn-primary">hello</button>
	<button class="btn">hello</button>
</div>

{#if selectedTab === 'home'}
	<HomeProfile
		user={data.user}
		isLoggedIn={data.isLoggedIn}
		isSelf={data.isSelf}
		comments={data.comments}
	/>
{/if}
