<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import { m } from '$lib/paraglide/messages';

	let showConfirm: boolean = $state(false);
	let errorMessage: string = $state('');

	let email: string = $state('');

	let { open = $bindable(false) }: { open: any } = $props();
	let dialogEl: HTMLDialogElement | undefined = $state();
	let isLoading: boolean = $state(false);

	$effect(() => {
		if (!dialogEl) return;
		if (open && !dialogEl.open) dialogEl.showModal();
		if (!open && dialogEl.open) dialogEl.close();
	});
</script>

<dialog
	bind:this={dialogEl}
	onclose={() => (open = false)}
	onclick={(e) => {
		if (e.target == dialogEl) open = false;
	}}
	class="lightbox"
>
	<form
		method="POST"
		action="?/changeEmail"
		use:enhance={() => {
			errorMessage = '';
			showConfirm = false;
			showConfirm = false;
			isLoading = true;
			return async ({ result, update }) => {
				isLoading = false;
				if (result.type === 'success') {
					showConfirm = true;
				} else if (result.type === 'failure') {
					errorMessage = (result.data?.error as string) ?? m.p_error_mail();
				}
				await update();
			};
		}}
	>
		<div class="lightbox-content m-8">
			<h2>{m.p_change_mail_h()}</h2>
			<p class="mb-5">{m.p_change_mail_warn()}</p>
			<input
				name="email"
				class="text-box"
				type="email"
				bind:value={email}
				placeholder={m.p_change_mail_dist()}
			/>
			{#if !isLoading}
				<div class="flex justify-center">
					<div>
						<button class="btn" type="submit">{m.p_submit_mail()}</button>
					</div>
					<div>
						<button class="btn" type="button" onclick={() => (open = false)}>
							{m.p_close_mail()}
						</button>
					</div>
				</div>
			{:else}
				<span class="loading loading-sm loading-spinner"></span>
			{/if}
			{#if showConfirm == true}
				<p>{m.p_change_mail_ok()}</p>
			{/if}
			{#if errorMessage !== ''}
				<FormError message={errorMessage} />
			{/if}
		</div>
	</form>
</dialog>

<style>
	dialog.lightbox {
		border: none;
		border-radius: 0.75rem;
		padding: 0;
		max-width: 32rem;
		width: 90vw;

		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin: 0;
	}
	dialog.lightbox::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
</style>
