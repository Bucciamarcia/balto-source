<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>{page.status} | Balto Source</title></svelte:head>
<h1>{page.status}</h1>
<p>{page.error?.message}</p>
