<script lang="ts">
	import ShowComments from '$lib/components/layout/comments/ShowComments.svelte';
	import SingleNews from '../../SingleNews.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleNews news={data.news} comments={data.comments} showCommentsLine={false} />
<div class="w-full max-w-3xl">
	<ShowComments isLoggedIn={data.isLoggedIn} targetId={data.news.id} comments={data.comments} />
</div>
