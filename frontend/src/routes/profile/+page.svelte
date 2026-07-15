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

	let { data } = $props();
	let editMode = $state(false);
	let newUsername: string = $state('');
	let formEl: HTMLFormElement | undefined = $state();
	let errorMessage: string = $state('');
	let showEmailModal: boolean = $state(false);
	let showPassModal: boolean = $state(false);
	let showAvatarModal: boolean = $state(false);
	let showTipTapEditor: boolean = $state(false);
	// svelte-ignore state_referenced_locally
	let htmlBio: string = $state(data.user?.bio ?? '');
	let profileId: string = $derived(data.user?.id ?? '');

	function renderBio(v: string | undefined): string {
		if (v === undefined) {
			return "Can't find bio.";
		} else if (v === '') {
			return "This user doesn't have any bio.";
		} else {
			return v;
		}
	}
</script>

{#if data.status === 400}
	<p>You need to log in to see your profile</p>
{:else if data.status === 404}
	<p>User not found</p>
{:else}
	<div class="flex w-full justify-center">
		{#if editMode === false}
			<div><h1 class="text-center">{data.user?.username}</h1></div>
		{:else}
			<form
				bind:this={formEl}
				method="POST"
				action="?/changeUsername"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();

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
		{#if data.isSelf}
			<div>
				<EditButtonSvg
					{editMode}
					flipMode={() => (editMode = !editMode)}
					onUsernameChanged={() => {
						errorMessage = '';
						formEl?.requestSubmit();
					}}
				/>
			</div>
		{/if}
	</div>
	{#if data.user}
		<AvatarRow bind:open={showAvatarModal} user={data.user} isSelf={data.isSelf} />
	{/if}
	{#if data.isSelf}
		<div class="mt-5 flex w-full justify-center">
			<div class="mr-5">
				<ProfileButton label="Change email" onClick={() => (showEmailModal = true)} />
			</div>
			<div><ProfileButton label="Change password" onClick={() => (showPassModal = true)} /></div>
		</div>
		<ChangeEmailDialog bind:open={showEmailModal}></ChangeEmailDialog>
		<ChangePassDialog bind:open={showPassModal}></ChangePassDialog>
	{/if}
{/if}
<div>{@html renderBio(data.user?.bio)}</div>
<div class="mt-8 grid place-items-center">
	{#if data.isSelf}
		<button onclick={() => (showTipTapEditor = !showTipTapEditor)} class="btn btn-primary"
			>{showTipTapEditor ? 'Close editor' : 'Edit bio'}</button
		>
	{/if}
</div>
{#if data.isSelf && showTipTapEditor == true}
	<div class="mx-auto">
		<TipTapEditor content={data.user?.bio ?? ''} header="Edit your profile" bind:value={htmlBio} />
	</div>
	<form
		method="POST"
		action="?/updateBio"
		use:enhance={() => {
			return async ({ result, update }) => {
				await update();

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
		<button class="btn cursor-pointer btn-primary" type="submit">Update your bio</button>
	</form>
{/if}
{#if errorMessage !== ''}
	<FormError message="Error: {errorMessage}" />
{/if}
<div class="w-full max-w-3xl">
	<ShowComments
		comments={data.comments ?? []}
		targetId={profileId}
		isLoggedIn={data.isLoggedIn ?? false}
	/>
</div>
