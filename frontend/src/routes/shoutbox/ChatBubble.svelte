<script lang="ts">
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import FormattedDate from '$lib/components/FormattedDate.svelte';
	import type { Locale } from '$lib/paraglide/runtime';
	import type { ChatMessagesResponse, UsersResponse } from '$lib/pocketbase-types';

	type Message = ChatMessagesResponse<{ author: UsersResponse }>;
	let { message, user, language }: { message: Message; user: string | null; language: Locale } =
		$props();
</script>

<div class="chat {message.author === user ? 'chat-end' : 'chat-start'}">
	<div class="avatar chat-image">
		<div class="w-10 rounded-full">
			<a href={`/${language}/profile?id=${message.expand.author.id}`}>
				<img
					src={buildAvatarUrl(message.expand.author)}
					alt="{message.expand.author.username} avatar"
				/>
			</a>
		</div>
	</div>
	<div class="chat-header">
		<a class="no-underline" href={`/${language}/profile?id=${message.expand.author.id}`}>
			{message.expand.author.username}</a
		>
		- <FormattedDate date={new Date(message.created)} />
	</div>
	<div class="chat-bubble">
		{message.body}
	</div>
</div>
