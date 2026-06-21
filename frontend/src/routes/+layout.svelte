<script lang="ts">
	import './layout.css';
	import SideMenu from '$lib/components/layout/side-menu.svelte';
	import HeadBanner from '$lib/components/layout/head-banner.svelte';
	import HeadMenu from '$lib/components/layout/head-menu/Head-menu.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import titleIcon from '$lib/assets/placeholderTitleIcon.png';

	let { children } = $props();
</script>

<svelte:head>
	<!-- <link href={favicon} rel="icon"/> -->
	<link href={titleIcon} rel="icon" type="image/png" />
</svelte:head>

<!-- Outer Container: Stacks things vertically -->
<div class="flex min-h-screen flex-col">
	<!-- Top Bar: Takes up 100% width automatically -->
	<div class="bg-slate-800 p-4 text-white">
		<HeadBanner />
		<HeadMenu />
	</div>

	<!-- Bottom Section: Holds the columns side-by-side -->
	<div class="flex flex-1 flex-nowrap items-start">
		<!-- Left Column (Stays as small as SideMenu allows) -->
		<div class="flex-none p-4">
			<SideMenu />
		</div>

		<!-- Right Column (Fills the rest) -->
		<main
			class="container m-20 rounded-md border-3 border-solid border-primary bg-neutral/75 px-20 py-10"
		>
			{@render children()}
		</main>
	</div>
	<div class="flex flex-1">
		<Footer />
	</div>
</div>

<style>
	div {
		background-image: url('$lib/assets/main-background-image.avif');
	}
</style>
