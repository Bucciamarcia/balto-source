<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import type { Locale } from '$lib/paraglide/runtime';
	import type { CommentsResponse, UsersResponse } from '$lib/pocketbase-types';
	import SingleCommentDisplay from './SingleCommentDisplay.svelte';
	import TipTapEditor from './TipTapEditor.svelte';
	import { m } from '$lib/paraglide/messages';

	let {
		comments,
		targetId,
		isLoggedIn,
		isVerified,
		language
	}: {
		comments: CommentsResponse<{ author: UsersResponse }>[];
		targetId: string;
		isLoggedIn: boolean;
		isVerified: boolean;
		language: Locale;
	} = $props();
	let replyId: string = $state('');
	let replyValue: string = $state('');
	let commentKey: number = $state(0);
	let errorMessage: string = $state('');
	let showCommentSuccess: boolean = $state(false);
	let comment: string = $state('');
	let isLoading: boolean = $state(false);

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

{#if isLoggedIn && isVerified}
	<form
		method="POST"
		action="?/addComment"
		use:enhance={() => {
			showCommentSuccess = false;
			errorMessage = '';
			isLoading = true;
			return async ({ result, update }) => {
				await update();
				isLoading = false;

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
			<TipTapEditor content="" header={m.comment_show()} bind:value={comment} />
		{/key}
		<input name="parent" type="hidden" value={null} />
		<input name="comment" type="hidden" bind:value={comment} />
		<input name="targetId" type="hidden" bind:value={targetId} />
		{#if isLoading}
			<span class="loading loading-spinner text-primary"></span>
		{:else}
			<button class="btn cursor-pointer btn-primary" type="submit">{m.comment_add_comment()}</button
			>
		{/if}
		{#if errorMessage !== ''}
			<FormError message={errorMessage} />
		{/if}
	</form>
{/if}
{#if showCommentSuccess}
	<p class="text-green-300">{m.comment_sent_ok}</p>
{/if}
{#if comments?.length == 0 || !comments}
	<p>{m.no_comments_comment()}</p>
{:else}
	{#each rootComments() as comment}
		<div class="mt-5 border-2 border-accent p-5">
			<SingleCommentDisplay {comment} {language} />
			{#if isLoggedIn && isVerified}
				<button
					class="btn mt-5 btn-primary"
					onclick={() => {
						if (isOpen(comment.id)) {
							replyId = '';
						} else {
							replyId = comment.id;
						}
					}}>{isOpen(comment.id) ? m.close_comment() : m.reply_comment()}</button
				>
			{/if}
			{#if replyId == comment.id}
				<form
					method="POST"
					action="?/addComment"
					use:enhance={() => {
						isLoading = true;
						return async ({ result, update }) => {
							await update();
							isLoading = false;

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
						<TipTapEditor content="" header={m.reply_comment_header()} bind:value={replyValue} />
					{/key}
					<input name="parent" type="hidden" value={comment.id} />
					<input name="comment" type="hidden" value={replyValue} />
					<input name="targetId" type="hidden" value={targetId} />
					{#if isLoading}
						<span class="loading loading-spinner text-primary"></span>
					{:else}
						<button class="btn cursor-pointer btn-primary" type="submit"
							>{m.add_comment_submit()}</button
						>
					{/if}
					{#if errorMessage !== ''}
						<FormError message={errorMessage} />
					{/if}
				</form>
			{/if}
			{#each childComments(comment.id) as child}
				<div class="mt-5 border-2 border-accent p-5">
					<SingleCommentDisplay comment={child} {language} />
				</div>
			{/each}
		</div>
	{/each}
{/if}
