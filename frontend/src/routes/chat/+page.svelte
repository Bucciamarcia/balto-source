<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

{#each data.messages as message}
	<p>created: {message.created}</p>
	<p>body: {message.body}</p>
	<p>author: {message.expand?.author.username}</p>
{/each}
