<script lang="ts">
	import type { HomepageNewsResponse, UsersResponse } from '$lib/pocketbase-types';

	let { news }: { news: HomepageNewsResponse<{ author: UsersResponse }> } = $props();
</script>

<p>Title: {news.title}</p>
<p>Body: {news.body}</p>
<p>Author: {news.author}</p>
<p>Author exp: {news.expand.author.username}</p>
<p>Avatar: {news.expand.author.avatar == '' ? 'No avatar' : news.expand.author.avatar}</p>
