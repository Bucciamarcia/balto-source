<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	let { data } = $props();
	let title = $derived(data.fanart.title);
	let description = $derived(data.fanart.description);
</script>

<svelte:head><title>{m.fa_edit_title({ name: data.fanart.title })}</title></svelte:head>
<h1 class="text-center">{m.fa_edit_head({ name: data.fanart.title })}</h1>
<form method="POST" use:enhance class="flex flex-col items-center">
	<fieldset class="fieldset">
		<legend class="fieldset-legend text-white">Title</legend>
		<input
			type="text"
			class="input text-black"
			name="title"
			placeholder="Insert the new title here"
			bind:value={title}
		/>
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend text-white">Description</legend>
		<textarea
			class="textarea h-24 text-black"
			placeholder="Insert the new description here"
			bind:value={description}
		></textarea>
	</fieldset>
</form>
