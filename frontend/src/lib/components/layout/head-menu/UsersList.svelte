<script lang="ts">
	let { title, open = $bindable(false) }: { title: string; open: any } = $props();
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
		<p>no moi</p>
	</div>
</dialog>
