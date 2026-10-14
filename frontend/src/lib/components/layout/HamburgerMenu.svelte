<script lang="ts">
	import SideMenu from '#lib/components/layout/SideMenu.svelte';
	import HamburgerMenuIcon from '#lib/assets/Hamburger-Menu-Icon.avif';
	import CloseIcon from '#lib/assets/X-Close-Icon.avif';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import type { Source } from '../getSourceSlug';

	let isOpen: boolean = $state(false);

	let { source }: Props = $props();

	interface Props {
		source: Source;
	}

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<!-- Mobile Hamburger Side Menu -->

<div class="flex flex-1">
	<button onclick={toggleMenu}>
		{#if !isOpen}
			<!-- Hamburger Icon -->
			<img src={HamburgerMenuIcon} alt="Hamburger Menu Icon" class="max-w-none min-w-[30px]" />
		{:else}
			<!-- X Close Icon -->
			<img src={CloseIcon} alt="X Close Icon" class="max-w-none min-w-[30px]" />
			<div class="dropdown-content bg-base-transparent h-full text-left md:hidden">
				<SideMenu language={getLocale()} {source} />
			</div>
		{/if}
	</button>
</div>
