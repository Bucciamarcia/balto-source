<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import type { CommentsResponse, UsersResponse } from '$lib/pocketbase-types';
	import SingleCommentDisplay from './SingleCommentDisplay.svelte';
	import TipTapEditor from './TipTapEditor.svelte';

	let {
		comments,
		targetId,
		isLoggedIn
	}: {
		comments: CommentsResponse<{ author: UsersResponse }>[];
		targetId: string;
		isLoggedIn: boolean;
	} = $props();
	let replyId: string = $state('');
	let replyValue: string = $state('');
	let commentKey: number = $state(0);
	let errorMessage: string = $state('');
	let showCommentSuccess: boolean = $state(false);
	let comment: string = $state('');

	function isOpen(commentId: string): boolean {
		if (replyId == commentId) return true;
		return false;
	}

	function rootComments(): CommentsResponse<{ author: UsersResponse }>[] {
		return comments.filter((c) => c.parent === '');
	}

	function childComments(parentId: string): CommentsResponse<{ author: UsersResponse }>[] {
		return comments.filter((c) => c.parent === parentId);
	}
</script>

{#if isLoggedIn}
	<form
		method="POST"
		action="?/addComment"
		use:enhance={() => {
			showCommentSuccess = false;
			errorMessage = '';
			return async ({ result, update }) => {
				await update();

				if (result.type === 'failure') {
					console.log(result.data);
					errorMessage = (result.data?.error as string) ?? 'Unknown error';
				}
				if (result.type === 'success') {
					comment = '';
					commentKey++;
					showCommentSuccess = true;
				}
			};
		}}
	>
		{#key commentKey}
			<TipTapEditor content="" header="Add a comment" bind:value={comment} />
		{/key}
		<input name="parent" type="hidden" value={null} />
		<input name="comment" type="hidden" bind:value={comment} />
		<input name="targetId" type="hidden" bind:value={targetId} />
		<button class="btn cursor-pointer btn-primary" type="submit">Add comment</button>
	</form>
{/if}
{#if showCommentSuccess}
	<p class="text-green-300">Comment sent successfully!</p>
{/if}
{#if comments?.length == 0 || !comments}
	<p>No comments yet. Be the first!</p>
{:else}
	{#each rootComments() as comment}
		<div class="mt-5 border-2 border-accent p-5">
			<SingleCommentDisplay {comment} />
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
								replyId = '';
							}
						};
					}}
				>
					{#key commentKey}
						<TipTapEditor content="" header="Reply to comment" bind:value={replyValue} />
					{/key}
					<input name="parent" type="hidden" value={comment.id} />
					<input name="comment" type="hidden" value={replyValue} />
					<input name="targetId" type="hidden" value={targetId} />
					<button class="btn cursor-pointer btn-primary" type="submit">Add comment</button>
					{#if errorMessage !== ''}
						<FormError message={errorMessage} />
					{/if}
				</form>
			{/if}
			{#each childComments(comment.id) as child}
				<div class="mt-5 border-2 border-accent p-5">
					<SingleCommentDisplay comment={child} />
				</div>
			{/each}
		</div>
	{/each}
{/if}
