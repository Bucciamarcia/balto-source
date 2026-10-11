<script lang="ts">
	import type { CharacterSex } from '../../upload/+page.server';
	import FemaleIcon from './FemaleIcon.svelte';
	import MaleIcon from './MaleIcon.svelte';

	let { sex }: { sex: CharacterSex } = $props();
</script>

{#if sex === 'male'}
	<MaleIcon />
{:else}
	<FemaleIcon />
{/if}
