<script lang="ts">
	import EditButtonSvg from './EditButtonSvg.svelte';
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import ProfileButton from './ProfileButton.svelte';
	import ChangeEmailDialog from './ChangeEmailDialog.svelte';
	import ChangePassDialog from './ChangePassDialog.svelte';
	import AvatarRow from './AvatarRow.svelte';
	import TipTapEditor from '$lib/components/layout/comments/TipTapEditor.svelte';
	import ShowComments from '$lib/components/layout/comments/ShowComments.svelte';
	import type { CommentsResponse, UsersResponse } from '$lib/pocketbase-types';
	import { m } from '$lib/paraglide/messages';
	import type { Locale } from '$lib/paraglide/runtime';

	let {
		user,
		isSelf,
		isLoggedIn,
		comments,
		isVerified,
		language
	}: {
		user: UsersResponse;
		isSelf: boolean;
		isLoggedIn: boolean;
		comments: CommentsResponse<{ author: UsersResponse }>[];
		isVerified: boolean;
		language: Locale;
	} = $props();
	let editMode = $state(false);
	let newUsername: string = $state('');
	let formEl: HTMLFormElement | undefined = $state();
	let errorMessage: string = $state('');
	let showEmailModal: boolean = $state(false);
	let showPassModal: boolean = $state(false);
	let showAvatarModal: boolean = $state(false);
	let showTipTapEditor: boolean = $state(false);
	// svelte-ignore state_referenced_locally
	let htmlBio: string = $state(user?.bio ?? '');
	let profileId: string = $derived(user?.id ?? '');
	let isLoading: boolean = $state(false);

	function renderBio(v: string | undefined): string {
		if (v === undefined) {
			return m.bio_no();
		} else if (v === '') {
			return m.bio_no_find();
		} else {
			return v;
		}
	}
</script>

<div class="flex w-full justify-center">
	{#if editMode === false}
		<div><h1 class="text-center">{user?.username}</h1></div>
	{:else}
		<form
			bind:this={formEl}
			method="POST"
			action="?/changeUsername"
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
						editMode = false;
					}
				};
			}}
		>
			<input class="text-black" name="newUsername" type="text" bind:value={newUsername} />
		</form>
	{/if}
	{#if isSelf && isVerified}
		<div>
			<EditButtonSvg
				{editMode}
				flipMode={() => (editMode = !editMode)}
				onUsernameChanged={() => {
					errorMessage = '';
					formEl?.requestSubmit();
				}}
				{isLoading}
			/>
		</div>
	{/if}
</div>
{#if errorMessage !== ''}
	<FormError message="Error: {errorMessage}" />
{/if}
{#if user}
	<AvatarRow bind:open={showAvatarModal} {user} {isSelf} {isVerified} />
{/if}
{#if isSelf && isVerified}
	<div class="mt-5 flex w-full justify-center">
		<div class="mr-5">
			<ProfileButton label={m.bio_change_mail()} onClick={() => (showEmailModal = true)} />
		</div>
		<div><ProfileButton label={m.bio_change_pass()} onClick={() => (showPassModal = true)} /></div>
	</div>
	<ChangeEmailDialog bind:open={showEmailModal}></ChangeEmailDialog>
	<ChangePassDialog bind:open={showPassModal}></ChangePassDialog>
{/if}
<div>{@html renderBio(user?.bio)}</div>
<div class="mt-8 grid place-items-center">
	{#if isSelf && isVerified}
		<button onclick={() => (showTipTapEditor = !showTipTapEditor)} class="btn btn-primary">
			{showTipTapEditor ? m.bio_close_editor() : m.bio_edit_bio()}
		</button>
	{/if}
</div>
{#if isSelf && showTipTapEditor == true}
	<div class="mx-auto">
		<TipTapEditor content={user?.bio ?? ''} header={m.bio_edit_profile()} bind:value={htmlBio} />
	</div>
	<form
		method="POST"
		action="?/updateBio"
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
					showTipTapEditor = false;
				}
			};
		}}
		class="flex w-full justify-center"
	>
		<input name="html" type="hidden" bind:value={htmlBio} />
		<button class="btn cursor-pointer btn-primary" type="submit">{m.submit_update_bio()}</button>
	</form>
{/if}
{#if errorMessage !== ''}
	<FormError message="Error: {errorMessage}" />
{/if}
<div class="w-full max-w-3xl">
	<ShowComments
		comments={comments ?? []}
		targetId={profileId}
		isLoggedIn={isLoggedIn ?? false}
		isVerified
		{language}
	/>
</div>
