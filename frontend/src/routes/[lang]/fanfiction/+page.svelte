<script lang="ts">
	import type { PageProps } from './$types';
	import FanficSearchBox from './FanficSearchBox.svelte';
	import FanfictionGallery from './FanfictionGallery.svelte';
	let { data, form }: PageProps = $props();
	let filteredFanfiction = $derived(form?.result);
</script>

<svelte:head>
	<title>Fanfi ctions - Balto Source</title>
</svelte:head>
<div class="fanficBody">
	<div class="fanficSearch">
		<FanficSearchBox action="?/filter" />
		<FanfictionGallery
			fanfictions={filteredFanfiction == null ? data.fanfictions : filteredFanfiction}
			fanfictionsFavorites={data.favorites}
			language={data.language}
		/>
	</div>

	<div class="fanficTitle">
		<header><h1>Balto Fanfics</h1></header>
	</div>
	<div class="fanficAuthors">
		<h3>Authors</h3>
	</div>
	<div class="fanficRightBody">
		<div class="fanficPopular">
			<h3>Popular fanfics</h3>
		</div>
		<div class="fanficRecent">
			<h3>Recently Uploaded</h3>
		</div>
	</div>
</div>

<style>
	.fanficTitle {
		font-size: 15px;
		width: 600px;
		line-height: 25px;
		position: absolute;
		top: 0;
		left: 0;
	}

	.fanficAuthors {
		/* Top left of body under fanfic search */
		text-align: left;
		width: 240px;
		float: left;
		clear: left;
	}

	.fanficPopular {
		/* Top right of body under today's artist */
		text-align: left;
	}

	.fanficRecent {
		/* just below popular fanfics */
		text-align: left;
	}

	.fanficSearch {
		/* Top left of body */
		float: left;
		padding: 5px 5px 2px 5px;
	}

	.fanficBody {
		color: #fff;
		position: relative;
		padding-top: 90px;
	}

	.fanficRightBody {
		float: right;
		width: 240px;
		display: block;
		margin: 6px;
	}
</style>
