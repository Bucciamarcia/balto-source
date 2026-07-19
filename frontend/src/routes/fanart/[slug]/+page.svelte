<script lang="ts">
	import SingleFanartDisplay from '$lib/components/layout/fanarts/SingleFanartDisplay.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.fanart.title} by {data.fanart.expand.author.username} - Balto Source</title>
</svelte:head>
<SingleFanartDisplay
	fanart={data.fanart}
	comments={data.comments}
	user={data.user}
	favs={data.favs}
	alreadyFaved={data.alreadyFaved}
/>
