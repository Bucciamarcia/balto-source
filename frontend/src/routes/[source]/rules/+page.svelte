<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>{m.rules_title()} - {data.source}</title></svelte:head>
<h1 class="text-center">{m.rules_title()}</h1>
{@html m.rules_content()}
