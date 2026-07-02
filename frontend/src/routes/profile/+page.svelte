<script lang="ts">
	import EditButtonSvg from './EditButtonSvg.svelte';

	let { data } = $props();
	let editMode = $state(false);
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
			<div><h1>edit mode</h1></div>
		{/if}
		{#if data.isSelf}
			<EditButtonSvg onEdit={() => (editMode = !editMode)} />
		{/if}
	</div>
	<p>IsSelf: {data.isSelf ?? 'noep'}</p>
{/if}
