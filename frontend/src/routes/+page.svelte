<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>We are so back</h1>
<br />
<br />
<p><a href="/signup">sign up</a></p>
<p><a href="/login">login</a></p>

{#each data.resultList as news}
	<p>title: {news['title']}</p>
	<p>body: {news['body']}</p>
	<p>author: {news['author']}</p>
	<p>created: {news['created']}</p>
{/each}
