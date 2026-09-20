<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { PageProps } from './$types';
	import FanficSearchBox from './FanficSearchBox.svelte';
	import FanfictionGallery from './FanfictionGallery.svelte';
	let { data, form }: PageProps = $props();
	let filteredFanfiction = $derived(form?.result);
</script>

<svelte:head>
	<title>{m.ff_t}</title>
</svelte:head>

<FanficSearchBox action="?/filter" />
<FanfictionGallery
	fanfictions={filteredFanfiction == null ? data.fanfictions : filteredFanfiction}
	fanfictionsFavorites={data.favorites}
	language={data.language}
/>
