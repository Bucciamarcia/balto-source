<script lang="ts">
	import SingleFanartDisplay from '$lib/components/layout/fanarts/SingleFanartDisplay.svelte';

	let { data } = $props();
</script>

<SingleFanartDisplay
	fanart={data.fanart}
	comments={data.comments}
	user={data.user}
	favs={data.favs}
	alreadyFaved={data.alreadyFaved}
/>
