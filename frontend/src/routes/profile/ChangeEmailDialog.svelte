<script lang="ts">
	let { open = $bindable(false), onConfirm }: { onConfirm: (val: string) => void; open: any } =
		$props();
	let dialogEl: HTMLDialogElement | undefined = $state();

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
	<div class="lightbox-content m-8">
		<h2>Change email address</h2>
		<p class="mb-5">You will receive an email to the new address to confirm the change.</p>
		<div class="flex justify-center">
			<div>
				<button
					class="btn"
					onclick={() => {
						onConfirm('ciao');
						open = false;
					}}>Confirm</button
				>
			</div>
			<div><button class="btn" onclick={() => (open = false)}>Close</button></div>
		</div>
	</div>
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
