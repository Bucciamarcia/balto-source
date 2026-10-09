<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';

	let { data } = $props();
	let title = $derived(data.fanfiction.title);
	let description = $derived(data.fanfiction.description);
</script>

<svelte:head><title>{m.ff_edit_title({ title: data.fanfiction.title })}</title></svelte:head>

<h1 class="text-center">{m.ff_edit_head({ title: data.fanfiction.title })}</h1>
<form method="POST" use:enhance class="flex flex-col items-center" enctype="multipart/form-data">
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
		<input
			type="text"
			class="input text-black"
			name="title"
			placeholder="Insert new description here"
			bind:value={description}
		/>
	</fieldset>
</form>
