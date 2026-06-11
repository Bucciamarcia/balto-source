<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';
	import type { PageData } from './$types';
	import type { ChatMessagesResponse, UsersResponse } from '$lib/pocketbase-types';

	let { data }: { data: PageData } = $props();

	type Message = ChatMessagesResponse<{ author: UsersResponse }>;

	let messages = $state<Message[]>(untrack(() => [...data.messages]));
	let text = $state('');

	const pb = new PocketBase('http://127.0.0.1:8090');

	onMount(() => {
		let unsubscribe: (() => void) | undefined;

		pb.collection('chat_messages')
			.subscribe<Message>(
				'*',
				(e) => {
					if (e.action === 'create') {
						messages = [...messages, e.record];
					} else if (e.action === 'update') {
						messages = messages.map((m) => (m.id === e.record.id ? e.record : m));
					} else if (e.action === 'delete') {
						messages = messages.filter((m) => m.id !== e.record.id);
					}
				},
				{ expand: 'author' }
			)
			.then((unsub) => {
				unsubscribe = unsub;
			});

		return () => {
			unsubscribe?.();
		};
	});
</script>

{#each messages as message}
	<p>created: {message.created}</p>
	<p>body: {message.body}</p>
	<p>author: {message.expand?.author.username}</p>
{/each}
<form
	method="POST"
	action="?/sendMessage"
	use:enhance={() => {
		return async ({ update }) => {
			text = '';
			await update({
				reset: false,
				invalidateAll: false
			});
		};
	}}
>
	<input name="message" type="text" bind:value={text} placeholder="Message..." />
	<button type="submit">Submit</button>
</form>
