<script lang="ts">
	import type { PageData } from './$types';
	import FanartGallery from '$lib/components/layout/fanarts/FanartGallery.svelte';
	import FanartSearchBox from './FanartSearchBox.svelte';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Fanart - Balto Source</title>
</svelte:head>
<FanartSearchBox action="?/filter" />
<FanartGallery fanarts={data.fanarts} />
