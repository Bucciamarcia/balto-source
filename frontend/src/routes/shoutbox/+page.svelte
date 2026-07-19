<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';
	import type { PageData } from './$types';
	import type { ChatMessagesResponse, UsersResponse } from '$lib/pocketbase-types';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';
	import ChatBubble from './ChatBubble.svelte';

	let { data }: { data: PageData } = $props();

	type Message = ChatMessagesResponse<{ author: UsersResponse }>;

	let messages: Message[] = $state<Message[]>(untrack(() => [...data.messages]));
	let text = $state('');
	// svelte-ignore non_reactive_update
	let inputEl: HTMLInputElement;

	const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	onMount(() => {
		inputEl.focus();
		inputEl.select();
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

	// Maike the chat scroll down
	let container: HTMLDivElement;
	$effect(() => {
		messages;
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	});

	// Select text
</script>

<svelte:head>
	<title>Shoutbox - Balto Source</title>
</svelte:head>
<div bind:this={container} class="max-h-128 overflow-y-auto">
	{#each messages as message}
		<ChatBubble {message} user={data.loggedUser} />
	{/each}
</div>
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
			setTimeout(() => {
				inputEl?.focus();
				inputEl?.select();
			});
		};
	}}
>
	{#if data.authenticated && data.isVerified}
		<input
			name="message"
			class="text-black"
			type="text"
			bind:value={text}
			placeholder="Message..."
			bind:this={inputEl}
		/>
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
		<button type="submit" class="btn cursor-pointer btn-primary">Submit</button>
	{/if}
</form>
