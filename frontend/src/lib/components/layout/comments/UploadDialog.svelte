<script lang="ts">
	import FormError from '#lib/components/formError.svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { localizeHref } from '#lib/paraglide/runtime.js';
	import { enhance } from '$app/forms';

	let {
		open = $bindable(false),
		onUploaded
	}: { open: boolean; onUploaded?: (fileName: string) => void } = $props();

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});

	let error = $state('');
	const ALLOWED_FILETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
	let fileTypeString = ALLOWED_FILETYPES.join(', ');
	let isLoading: boolean = $state(false);
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
		<p>{m.upload_image_dialog()}</p>
		<form
			method="POST"
			enctype="multipart/form-data"
			action={localizeHref(`/hub/profile?/uploadUserImage`)}
			use:enhance={() => {
				error = '';
				isLoading = true;

				return async ({ update, result }) => {
					await update({ navigate: false });
					if (result.type === 'failure') {
						error = (result.data?.error as string) ?? 'Unknown error';
					}
					if (result.type === 'success') {
						onUploaded?.((result.data?.fileName as string) ?? '');
						open = false;
					}
					isLoading = false;
				};
			}}
		>
			<input type="file" class="file-input mt-5" accept={fileTypeString} name="files" />
			{#if isLoading}
				<span class="on-neutral loading loading-md loading-spinner"></span>
			{:else}
				<button class="btn btn-success" type="submit">Add image</button>
			{/if}
			{#if error !== ''}
				<FormError message={error} />
			{/if}
		</form>
		<form method="dialog" class="modal-backdrop max-w-20">
			<button class="btn mt-5 text-error-content btn-error">Close</button>
		</form>
	</div>
</dialog>
