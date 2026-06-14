<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';
	import type { PageData } from './$types';
	import type { ChatMessagesResponse, UsersResponse } from '$lib/pocketbase-types';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';

	let { data }: { data: PageData } = $props();

	type Message = ChatMessagesResponse<{ author: UsersResponse }>;

	let messages: Message[] = $state<Message[]>(untrack(() => [...data.messages]));
	let text = $state('');

	const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	onMount(() => {
		let unsubscribe: (() => void) | undefined;

		pb.collection('chat_messages')
			.subscribe<Message>(
				'*',
				(e) => {
					if (e.action === 'create') {
						messages = pruneMessages([...messages, e.record]);
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

	function pruneMessages(messages: Message[]): Message[] {
		if (messages.length <= 20) {
			return messages;
		} else {
			return messages.slice(-20);
		}
	}
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
	{#if data.authenticated}
		<input name="message" type="text" bind:value={text} placeholder="Message..." />
	{:else}
		<input
			name="message"
			type="text"
			bind:value={text}
			placeholder="Log in or register to chat"
			disabled={true}
		/>
	{/if}
	{#if data.authenticated}
		<button type="submit">Submit</button>
	{/if}
</form>
