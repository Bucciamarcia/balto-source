<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import FanartUploader from './FanartUploader.svelte';
	import FanfictionUploader from './FanfictionUploader.svelte';

	let selected: string = $state('fanart');
</script>

<svelte:head>
	<title>{m.upload_title()}</title>
</svelte:head>
<div class="mb-10 flex w-full flex-wrap justify-center gap-3">
	<button
		class={`btn ${selected === 'fanart' ? 'btn-secondary' : 'btn-primary'}`}
		onclick={() => (selected = 'fanart')}
	>
		{m.upload_fanart_t()}
	</button>
	<button
		class={`btn ${selected === 'fanfiction' ? 'btn-secondary' : 'btn-primary'}`}
		onclick={() => (selected = 'fanfiction')}
	>
		{m.upload_fanfic_t()}
	</button>
</div>
{#if selected === 'fanart'}
	<FanartUploader />
{:else if selected === 'fanfiction'}
	<FanfictionUploader />
{/if}
