<script lang="ts">
	import type { PageProps } from './$types';
	import FanficSearchBox from './FanficSearchBox.svelte';
	import FanfictionGallery from './FanfictionGallery.svelte';
	let { data, form }: PageProps = $props();
	let filteredFanfiction = $derived(form?.result);
</script>

moi
<FanficSearchBox action="?/filter" />
<FanfictionGallery
	fanfictions={filteredFanfiction == null ? data.fanfictions : filteredFanfiction}
	fanfictionsFavorites={data.favorites}
/>
