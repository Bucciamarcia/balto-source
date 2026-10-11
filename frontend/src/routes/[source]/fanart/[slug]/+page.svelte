<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import SingleFanartDisplay from '$lib/components/layout/fanarts/SingleFanartDisplay.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>
		{m.fa_something_else({
			title: data.fanart.title,
			author: data.fanart.expand.author.username
		})}
	</title>
</svelte:head>
<SingleFanartDisplay
	fanart={data.fanart}
	comments={data.comments}
	user={data.user}
	favs={data.favs}
	alreadyFaved={data.alreadyFaved}
	isVerified={data.isVerified}
	locale={data.locale}
/>
