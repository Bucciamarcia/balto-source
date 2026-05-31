<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import SideMenu from '$lib/components/layout/side-menu.svelte';
    import HeadBanner from '$lib/components/layout/head-banner.svelte';
    import Footer from '$lib/components/layout/footer.svelte';

    let {children} = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon"/>
</svelte:head>

<!-- Outer Container: Stacks things vertically -->
<div class="flex min-h-screen flex-col">
    <!-- Top Bar: Takes up 100% width automatically -->
    <div class="bg-slate-800 p-4 text-white">
        <HeadBanner/>
    </div>

    <!-- Bottom Section: Holds the columns side-by-side -->
    <div class="flex flex-1">
        <!-- Left Column (Stays as small as SideMenu allows) -->
        <div class="flex-none bg-blue-100 p-4">
            <SideMenu/>
        </div>

        <!-- Right Column (Fills the rest) -->
        <div class="flex-1 p-4">
            {@render children()}
        </div>
    </div>
    <div class="flex flex-1 footer">
        <Footer/>
    </div>
</div>


<style>
    .footer {
        color: lightblue;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 10px;
    }
</style>