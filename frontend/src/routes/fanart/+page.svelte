<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import FanartGallery from '$lib/components/layout/fanarts/FanartGallery.svelte';
	import FanartSearchBox from './FanartSearchBox.svelte';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
	let filteredFanart = $derived(form?.result);
</script>

<svelte:head>
	<title>{m.fa_title()}</title>
</svelte:head>
<FanartSearchBox action="?/filter" />
<FanartGallery
	fanarts={filteredFanart == null ? data.fanarts : filteredFanart}
	fanartsFavorites={data.favorites}
	language={data.language}
/>
