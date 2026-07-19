<script lang="ts">
	import type { PageData } from './$types';
	import FanartGallery from '$lib/components/layout/fanarts/FanartGallery.svelte';
	let { data }: { data: PageData } = $props();
</script>

<FanartGallery fanarts={data.fanarts} />
