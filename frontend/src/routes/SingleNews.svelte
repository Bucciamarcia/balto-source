<script lang="ts">
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import FormattedDate from '$lib/components/FormattedDate.svelte';
	import type {
		CommentsResponse,
		HomepageNewsResponse,
		UsersResponse
	} from '$lib/pocketbase-types';

	let {
		news,
		comments,
		showCommentsLine
	}: {
		news: HomepageNewsResponse<{ author: UsersResponse }>;
		comments: CommentsResponse[];
		showCommentsLine: boolean;
	} = $props();

	function buildUserAvatarTag(user: UsersResponse): string {
		return `${user.username} avatar`;
	}
</script>

<div>
	<h2 class="mt-7">{news.title}</h2>
	<div class="mt-4 mb-4 flex">
		<div class="self-center">
			<p>By {news.expand.author.username}</p>
		</div>
		{#if news.expand.author.avatar != ''}
			<div class="mr-2 ml-2">
				<img
					src={buildAvatarUrl(news.expand.author)}
					alt={buildUserAvatarTag(news.expand.author)}
					height="40"
					width="40"
				/>
			</div>
			<div class="self-center">
				<p>On <FormattedDate date={new Date(news.created)} /></p>
			</div>
		{/if}
	</div>
	{@html news.body}
	{#if showCommentsLine}
		<div class="mt-4 flex gap-4 place-self-center">
			<a href="news/{news.id}" class="text-lg font-semibold text-blue-300"
				>{comments.length} comments</a
			>
		</div>
	{/if}
</div>
