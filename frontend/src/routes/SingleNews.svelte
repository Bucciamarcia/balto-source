<script lang="ts">
	import FormattedDate from '$lib/components/FormattedDate.svelte';
	import type { HomepageNewsResponse, UsersResponse } from '$lib/pocketbase-types';
	import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';

	let { news }: { news: HomepageNewsResponse<{ author: UsersResponse }> } = $props();

	function buildAvatarUrl(user: UsersResponse): string {
		return `${PUBLIC_POCKETBASE_URL}/api/files/users/${user.id}/${user.avatar}?thumb=40x40`;
	}

	function buildUserAvatarTag(user: UsersResponse): string {
		return `${user.username} avatar`;
	}
</script>

<div class="border">
	<h2>{news.title}</h2>
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
</div>
