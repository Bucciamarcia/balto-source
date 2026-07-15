<script lang="ts">
	import SingleNews from '../../SingleNews.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SingleNews news={data.news} comments={data.comments} showCommentsLine={false} />
