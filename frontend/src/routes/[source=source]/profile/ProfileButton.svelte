<script lang="ts">
	interface Props {
		label: string;
		onClick: () => void;
	}

	let { label, onClick }: Props = $props();
</script>

<form>
	<button
		type="submit"
		class="btn cursor-pointer no-underline btn-primary"
		onclick={() => {
			onClick();
		}}>{label}</button
	>
</form>
