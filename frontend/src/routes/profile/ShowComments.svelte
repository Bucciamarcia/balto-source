<script lang="ts">
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import type { CommentsResponse, UsersResponse } from '$lib/pocketbase-types';

	let { comments }: { comments: CommentsResponse<{ author: UsersResponse }>[] } = $props();
</script>

{#each comments as comment}
	<div class="mt-5 border-2 border-accent p-5">
		<div class="flex">
			<div class="mr-5 self-center">{comment.expand.author.username}</div>
			<div>
				<img
					src={buildAvatarUrl(comment.expand.author)}
					alt="{comment.expand.author.username} avatar"
				/>
			</div>
		</div>
	</div>
{/each}
