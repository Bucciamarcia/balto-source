<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';

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
					errorMessage = (result.data?.error as string) ?? 'An unknown error occurred';
				}
				await update();
			};
		}}
	>
		<div class="lightbox-content m-8">
			<h2>Change email address</h2>
			<p class="mb-5">You will receive an email to the new address to confirm the change.</p>
			<input
				name="email"
				class="text-box"
				type="email"
				bind:value={email}
				placeholder="New email address"
			/>
			{#if !isLoading}
				<div class="flex justify-center">
					<div>
						<button class="btn" type="submit">Submit</button>
					</div>
					<div><button class="btn" type="button" onclick={() => (open = false)}>Close</button></div>
				</div>
			{:else}
				<span class="loading loading-sm loading-spinner"></span>
			{/if}
			{#if showConfirm == true}
				<p>Request successful. Check your email address to confirm the email change</p>
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
