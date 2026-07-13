<script lang="ts">
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import FormattedDate from '$lib/components/FormattedDate.svelte';
	import type { CommentsResponse, UsersResponse } from '$lib/pocketbase-types';

	let { comment }: { comment: CommentsResponse<{ author: UsersResponse }> } = $props();
</script>

<div class="flex">
	<div class="mr-5 self-center">{comment.expand.author.username}</div>
	<img src={buildAvatarUrl(comment.expand.author)} alt="{comment.expand.author.username} avatar" />
	<div class="ml-5 self-center">
		<FormattedDate date={new Date(comment.created)} showTime={true} />
	</div>
</div>
<p class="mt-5">{@html comment.content}</p>
