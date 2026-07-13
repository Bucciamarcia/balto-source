<script lang="ts">
	import { enhance } from '$app/forms';
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import FormattedDate from '$lib/components/FormattedDate.svelte';
	import FormError from '$lib/components/formError.svelte';
	import type { CommentsResponse, UsersResponse } from '$lib/pocketbase-types';
	import TipTapEditor from './TipTapEditor.svelte';

	let {
		comments,
		profileId
	}: { comments: CommentsResponse<{ author: UsersResponse }>[]; profileId: string } = $props();
	let replyId: string = $state('');
	let replyValue: string = $state('');
	let commentKey: number = $state(0);
	let showReplySuccess: boolean = $state(false);
	let errorMessage: string = $state('');

	function isOpen(commentId: string): boolean {
		if (replyId == commentId) return true;
		return false;
	}
</script>

{#each comments as comment}
	<div class="mt-5 border-2 border-accent p-5">
		<div class="flex">
			<div class="mr-5 self-center">{comment.expand.author.username}</div>
			<img
				src={buildAvatarUrl(comment.expand.author)}
				alt="{comment.expand.author.username} avatar"
			/>
			<div class="ml-5 self-center">
				<FormattedDate date={new Date(comment.created)} />
			</div>
		</div>
		<p class="mt-5">{@html comment.content}</p>
		<button
			class="btn mt-5 btn-primary"
			onclick={() => {
				if (isOpen(comment.id)) {
					replyId = '';
				} else {
					replyId = comment.id;
				}
			}}>{isOpen(comment.id) ? 'Close' : 'Reply'}</button
		>
		{#if replyId == comment.id}
			<form
				method="POST"
				action="?/addComment"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();

						if (result.type === 'failure') {
							console.log(result.data);
							errorMessage = (result.data?.error as string) ?? 'Unknown error';
						}
						if (result.type === 'success') {
							replyValue = '';
							commentKey++;
							showReplySuccess = true;
						}
					};
				}}
			>
				{#key commentKey}
					<TipTapEditor content="" header="Reply to comment" bind:value={replyValue} />
				{/key}
				<input name="parent" type="hidden" value={comment.id} />
				<input name="comment" type="hidden" value={replyValue} />
				<input name="profileId" type="hidden" value={profileId} />
				<button class="btn cursor-pointer btn-primary" type="submit">Add comment</button>
				{#if showReplySuccess}
					<p class="mt-3 ml-5 self-center text-green-600">Comment sent successfully</p>
				{/if}
				{#if errorMessage !== ''}
					<FormError message={errorMessage} />
				{/if}
			</form>
			<div></div>
		{/if}
	</div>
{/each}
