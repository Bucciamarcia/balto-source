<script>
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	let { data } = $props();
</script>

<svelte:head>{m.ch_edit_head({ character: data.character.name })}</svelte:head>
<h1 class="text-center">{m.ch_edit_h1({ character: data.character.name })}</h1>
<h2 class="text-center">{m.ch_edit_avatar_head()}</h2>
<p class="text-center">{m.ch_edit_avatar_desc()}</p>
<form
	method="POST"
	action="?/editCharacter"
	use:enhance
	enctype="multipart/form-data"
	class="flex flex-col items-center"
>
	<input type="file" class="file-input mt-5 self-center text-black" name="avatar" />
</form>
