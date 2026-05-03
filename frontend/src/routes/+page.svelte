<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>We are so back</h1>

<p>{data.health.message}</p>
<p>{JSON.stringify(data.hello)}</p>
