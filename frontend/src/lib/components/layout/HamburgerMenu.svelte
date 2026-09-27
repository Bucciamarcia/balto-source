<script lang="ts">
	import SideMenu from '$lib/components/layout/SideMenu.svelte';
    import HamburgerMenuIcon from '$lib/assets/Hamburger-Menu-Icon.avif';
    import CloseIcon from '$lib/assets/X-Close-Icon.avif';
    import type { Locale } from '$lib/paraglide/runtime';

    interface Props {
	language: Locale;
	}
	let { language }: Props = $props();

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
	    <img src={HamburgerMenuIcon} alt="Hamburger Menu Icon" class="min-w-30px max-w-none" />
     {:else}
     <!-- X Close Icon -->
	    <img src={CloseIcon} alt="X Close Icon" class="min-w-30px max-w-none" />
            <div class="md:hidden dropdown-content h-full text-left">
            <SideMenu language={language} />
            </div>
    {/if}
    </button>
</div>