<script lang="ts">
	import SingleFanficDisplay from './SingleFanficDisplay.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.fanart.title} by {data.fanart.expand.author.username} - Balto Source</title>
</svelte:head>
<SingleFanficDisplay
	fanart={data.fanart}
	comments={data.comments}
	user={data.user}
	favs={data.favs}
	alreadyFaved={data.alreadyFaved}
	isVerified={data.isVerified}
/>
