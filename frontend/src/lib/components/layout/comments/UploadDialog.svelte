<script lang="ts">
	interface Props {
		open: boolean;
	}

	let { open = $bindable(false) }: Props = $props();

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => (open = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog?.close();
	}}
	id="upload-dialog"
	class="modal"
>
	<div class="modal-box bg-neutral">
		<p>moi</p>
		<form method="dialog" class="modal-backdrop max-w-20">
			<button class="btn mt-5 text-error-content btn-error">Close</button>
		</form>
	</div>
</dialog>
