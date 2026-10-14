<script lang="ts">
	import { buildAvatarUrl } from '#lib/components/buildAvatarUrl.js';
	import FormattedDate from '#lib/components/FormattedDate.svelte';
	import type { Source } from '#lib/components/getSourceSlug.js';
	import type { Locale } from '#lib/paraglide/runtime.js';
	import type {
		CommentsResponse,
		HomepageNewsResponse,
		UsersResponse
	} from '#lib/pocketbase-types.js';

	let {
		news,
		comments,
		showCommentsLine,
		language,
		source
	}: {
		news: HomepageNewsResponse<{ author: UsersResponse }>;
		comments: CommentsResponse[];
		showCommentsLine: boolean;
		language: Locale;
		source: Source;
	} = $props();

	function buildUserAvatarTag(user: UsersResponse): string {
		return `${user.username} avatar`;
	}
</script>

<div>
	<h2 class="mt-7">{news.title}</h2>
	<div class="mt-4 mb-4 flex">
		<div class="self-center">
			<a href="/{language}/{source}/profile?id={news.expand.author.id}"
				>By {news.expand.author.username}</a
			>
		</div>
		{#if news.expand.author.avatar != ''}
			<div class="mr-2 ml-2">
				<a href="/{language}/{source}/profile?id={news.expand.author.id}">
					<img
						src={buildAvatarUrl(news.expand.author)}
						alt={buildUserAvatarTag(news.expand.author)}
						height="40"
						width="40"
					/>
				</a>
			</div>
			<div class="self-center">
				<p>On <FormattedDate date={new Date(news.created)} /></p>
			</div>
		{/if}
	</div>
	{@html news.body}
	{#if showCommentsLine}
		<div class="mt-4 flex gap-4 place-self-center">
			<a href="/{language}/{source}/news/{news.id}" class="text-lg font-semibold text-blue-300"
				>{comments.length} comments</a
			>
		</div>
	{/if}
</div>
