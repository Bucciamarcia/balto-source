<script lang="ts">
	import EditButtonSvg from './EditButtonSvg.svelte';
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import ProfileButton from './ProfileButton.svelte';

	let { data } = $props();
	let editMode = $state(false);
	let newUsername: string = $state('');
	let formEl: HTMLFormElement | undefined = $state();
	let errorMessage: string = $state('');
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
	{#if errorMessage !== ''}
		<FormError message="Error: {errorMessage}" />
	{/if}
	{#if data.isSelf}
		<div class="mt-5 flex w-full justify-center">
			<div><ProfileButton label="moi" /></div>
		</div>
	{/if}
{/if}
