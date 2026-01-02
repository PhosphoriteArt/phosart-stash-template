<script lang="ts">
	import { page } from '$app/state';
	import Header from '$lib/Header.svelte';
	import { Gallery } from 'phosart-common';
	import { browser } from '$app/environment';
	import { executeSearch } from '$lib/search.js';

	const { data } = $props();

	const results = $derived(executeSearch(page.state.query ?? '', data.allPieces));
</script>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={[{ label: 'Search: ' + (page.state.query ?? ''), href: ['/search'] }]}
/>

{#if results}
	<div
		class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	>
		<Gallery {browser} pieces={results} />
	</div>
{:else}
	No Results (or loading)
{/if}
