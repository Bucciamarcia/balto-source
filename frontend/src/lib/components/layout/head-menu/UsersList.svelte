<script lang="ts">
	import { buildAvatarUrl } from '#lib/components/buildAvatarUrl.ts';
	import type { Source } from '#lib/components/getSourceSlug.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import type { UsersResponse } from '#lib/pocketbase-types.ts';

	let {
		title,
		open = $bindable(false),
		userFavs,
		source
	}: {
		title: string;
		open: boolean;
		userFavs: UsersResponse[];
		source: Source;
	} = $props();

	let dialog: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => (open = false)}
	onclick={(e) => {
		if (e.target == dialog) open = false;
	}}
	class="lightbox m-auto border-2 border-solid border-accent bg-primary"
>
	<div class="lightbox-content m-8">
		<h1>{title}</h1>
		<div class="flex flex-wrap justify-center gap-4">
			{#each userFavs as user}
				<div class="flex w-24 flex-col items-center gap-1 text-center">
					<a href="/{getLocale()}/{source}/profile?id={user.id}">
						<img
							class="size-16 rounded-full object-cover"
							src={buildAvatarUrl(user)}
							alt={m.ch_avatar_trab({ user: user.username })}
						/>
					</a>
					<a href="/{getLocale()}/{source}/profile?id={user.id}">
						<p class="w-full truncate text-sm">{user.username}</p>
					</a>
				</div>
			{/each}
		</div>
	</div>
</dialog>
