<script lang="ts">
	import EditButtonSvg from './EditButtonSvg.svelte';

	let { data } = $props();
	let editMode = $state(false);
	let newUsername: string = $state('');
</script>

{#if data.status === 400}
	<p>You need to log in to see your profile</p>
{:else if data.status === 404}
	<p>User not found</p>
{:else}
	<div class="flex">
		{#if editMode === false}
			<div><h1 class="text-center">{data.user?.username}</h1></div>
		{:else}
			<input class="text-black" name="newUsername" type="text" bind:value={newUsername} />
		{/if}
		{#if data.isSelf}
			<EditButtonSvg
				{editMode}
				flipMode={() => (editMode = !editMode)}
				onUsernameChanged={() => {
					console.log({ newUsername });
					editMode = !editMode;
				}}
			/>
		{/if}
	</div>
	<p>IsSelf: {data.isSelf ?? 'noep'}</p>
{/if}
