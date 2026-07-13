<script lang="ts">
	import type { CommentsResponse, UsersResponse } from '$lib/pocketbase-types';

	let { comments }: { comments: CommentsResponse<{ author: UsersResponse }>[] } = $props();
</script>

{#each comments as comment}
	<p>{comment.id}</p>
{/each}
