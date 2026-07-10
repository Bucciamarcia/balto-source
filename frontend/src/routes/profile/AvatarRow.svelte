<script lang="ts">
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import type { UsersResponse } from '$lib/pocketbase-types';
	let {
		user,
		isSelf,
		open = $bindable(false)
	}: { user: UsersResponse; isSelf: boolean; open: any } = $props();
	let isEditingAvatar: boolean = $state(false);
</script>

<div class="mt-5 mb-5 flex w-full justify-center">
	<div class="mr-5"><img src={buildAvatarUrl(user)} alt="" height="50" width="50" /></div>
	{#if isSelf}
		{#if isEditingAvatar}
			<button class="btn" onclick={() => (isEditingAvatar = false)}>Close</button>
		{:else}
			<button
				aria-label="Change username"
				class="cursor-pointer"
				onclick={() => (isEditingAvatar = true)}
			>
				<div class="tooltip self-center" data-tip="Change your avatar">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						stroke="currentColor"
						class="size-[1.2em]"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
						/>
					</svg>
				</div>
			</button>
		{/if}
	{/if}
</div>
