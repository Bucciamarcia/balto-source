<script lang="ts">
	import { buildAvatarUrl } from '#lib/components/buildAvatarUrl.js';
	import FormattedDate from '#lib/components/FormattedDate.svelte';
	import type { Source } from '#lib/components/getSourceSlug.js';
	import { m } from '#lib/paraglide/messages.js';
	import type { Locale } from '#lib/paraglide/runtime.js';
	import type { ChatMessagesResponse, UsersResponse } from '#lib/pocketbase-types.js';

	type Message = ChatMessagesResponse<{ author: UsersResponse }>;
	let {
		message,
		user,
		language,
		source
	}: { message: Message; user: string | null; language: Locale; source: Source } = $props();
</script>

<div class="chat {message.author === user ? 'chat-end' : 'chat-start'}">
	<div class="avatar chat-image">
		<div class="w-10 rounded-full">
			<a href={`/${language}/profile?id=${message.expand.author.id}`}>
				<img
					src={buildAvatarUrl(message.expand.author)}
					alt={m.sb_avatar({ name: message.expand.author.username })}
				/>
			</a>
		</div>
	</div>
	<div class="chat-header">
		<a class="no-underline" href={`/${language}/${source}/profile?id=${message.expand.author.id}`}>
			{message.expand.author.username}</a
		>
		- <FormattedDate date={new Date(message.created)} />
	</div>
	<div class="chat-bubble">
		{message.body}
	</div>
</div>
