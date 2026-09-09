<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.fanfiction.title} by {data.fanfiction.expand.author.username} - Balto Source</title>
</svelte:head>
