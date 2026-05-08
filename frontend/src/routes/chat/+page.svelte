<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let message: string = $state('');
</script>

{#each data.messages as message}
	<p>created: {message.created}</p>
	<p>body: {message.body}</p>
	<p>author: {message.expand?.author.username}</p>
{/each}
<form method="POST" action="?/sendMessage" use:enhance>
	<input name="message" type="message" bind:value={message} placeholder="Message..." />
	<button type="submit">Submit</button>
</form>
