<script lang="ts">
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import type { ChatMessagesResponse, UsersResponse } from '$lib/pocketbase-types';

	type Message = ChatMessagesResponse<{ author: UsersResponse }>;
	let { message, user }: { message: Message; user: string | null } = $props();
</script>

<div class="chat {message.author === user ? 'chat-end' : 'chat-start'}">
	<div class="avatar chat-image">
		<div class="w-10 rounded-full">
			<img
				src={buildAvatarUrl(message.expand.author)}
				alt="{message.expand.author.username} avatar"
			/>
		</div>
	</div>
	<div class="chat-bubble">
		{message.body}
	</div>
</div>
