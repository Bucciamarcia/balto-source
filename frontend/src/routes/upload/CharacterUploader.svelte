<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { CharacterSex } from './+page.server';
	let characterSex: CharacterSex = $state('male');
</script>

<h1>{m.upload_character_h()}</h1>
<fieldset class="fieldset">
	<legend class="fieldset-legend text-white">{m.upload_ch_name()}</legend>
	<input type="text" name="name" class="input text-black" placeholder={m.upload_ch_de()} />
</fieldset>
<fieldset class="fieldset">
	<legend class="fieldset-legend text-white">{m.upload_ch_pp_n()}</legend>
	<input type="file" class="file-input text-black" />
	<label class="label" for="avatar">{m.upload_ch_max()}</label>
</fieldset>
<fieldset class="fieldset">
	<legend class="fieldset-legend text-white">{m.upload_ch_ref_n()}</legend>
	<input type="file" class="file-input text-black" />
	<label class="label" for="avatar">{m.upload_ch_ref_max()}</label>
</fieldset>
<p class="fieldset-legend text-white">{m.upload_ch_sex()}</p>
<div class="flex items-center">
	<input
		type="radio"
		name="sex"
		value="male"
		class="radio mr-2 radio-primary"
		checked={characterSex === 'male'}
		bind:group={characterSex}
	/>
	<p class="text-white">{m.upload_ch_sex_m()}</p>
</div>
<div class="flex items-center">
	<input
		type="radio"
		name="sex"
		value="female"
		class="radio mr-2 radio-primary"
		checked={characterSex === 'female'}
		bind:group={characterSex}
	/>
	<p class="text-white">{m.upload_ch_sex_f()}</p>
</div>
<div class="flex items-center">
	<input
		type="radio"
		name="sex"
		value="other"
		class="radio mr-2 radio-primary"
		checked={characterSex === 'other'}
		bind:group={characterSex}
	/>
	<p class="text-white">{m.upload_ch_sex_o()}</p>
</div>
<textarea class="textarea mt-5 text-black" placeholder={m.upload_character_bio()} name="bio"
></textarea>
