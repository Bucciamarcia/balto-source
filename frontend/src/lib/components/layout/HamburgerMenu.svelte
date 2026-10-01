<script lang="ts">
	import SideMenu from '$lib/components/layout/SideMenu.svelte';
	import HamburgerMenuIcon from '$lib/assets/Hamburger-Menu-Icon.avif';
	import CloseIcon from '$lib/assets/X-Close-Icon.avif';
	import { getLocale } from '$lib/paraglide/runtime';

	let isOpen: boolean = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<!-- Mobile Hamburger Side Menu -->

<div class="flex flex-1">
	<button onclick={toggleMenu}>
		{#if !isOpen}
			<!-- Hamburger Icon -->
			<img src={HamburgerMenuIcon} alt="Hamburger Menu Icon" class="min-w-[30px] max-w-none" />
		{:else}
			<!-- X Close Icon -->
			<img src={CloseIcon} alt="X Close Icon" class="min-w-[30px] max-w-none" />
			<div class="dropdown-content bg-base-transparent h-full text-left md:hidden">
				<SideMenu language={getLocale()} />
			</div>
		{/if}
	</button>
</div>

