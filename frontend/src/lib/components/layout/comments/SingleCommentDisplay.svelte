<script lang="ts">
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import FormattedDate from '$lib/components/FormattedDate.svelte';
	import type { CommentsResponse, UsersResponse } from '$lib/pocketbase-types';

	let { comment }: { comment: CommentsResponse<{ author: UsersResponse }> } = $props();
</script>

<div class="flex">
	<a class="mr-5 self-center" href={`/profile?id=${comment.expand.author.id}`}
		>{comment.expand.author.username}</a
	>
	<a class="mr-5 self-center" href={`/profile?id=${comment.expand.author.id}`}>
		<img
			src={buildAvatarUrl(comment.expand.author)}
			alt="{comment.expand.author.username} avatar"
		/>
	</a>
	<div class="ml-5 self-center">
		<FormattedDate date={new Date(comment.created)} showTime={true} />
	</div>
</div>
<p class="mt-5">{@html comment.content}</p>
