<script lang="ts">
	import FanartUploader from './FanartUploader.svelte';

	let selected: string = $state('fanart');
</script>

<div class="mb-10 flex w-full flex-wrap justify-center gap-3">
	<button
		class={`btn ${selected === 'fanart' ? 'btn-secondary' : 'btn-primary'}`}
		onclick={() => (selected = 'fanart')}>Upload fanart</button
	>
	<button
		class={`btn ${selected === 'fanfiction' ? 'btn-secondary' : 'btn-primary'}`}
		onclick={() => (selected = 'fanfiction')}>Upload fanfiction</button
	>
</div>
{#if selected === 'fanart'}
	<FanartUploader />
{:else if selected === 'fanfiction'}
	Sorry, fanfictions are not yet available!
{/if}
