<script lang="ts">
	import FanartGallery from '$lib/components/layout/fanarts/FanartGallery.svelte';
	import FanartSearchBox from './FanartSearchBox.svelte';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
	let filteredFanart = $derived(form?.result);
</script>

<svelte:head>
	<title>Fanart - Balto Source</title>
</svelte:head>
<FanartSearchBox action="?/filter" />
<FanartGallery fanarts={filteredFanart == null ? data.fanarts : filteredFanart} />
