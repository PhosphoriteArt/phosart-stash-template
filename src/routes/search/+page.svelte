<script lang="ts">
	import Header from '$lib/Header.svelte';
	import { Gallery } from '@phosart/common';
	import { browser } from '$app/environment';
	import { executeSearch } from '@phosart/common/util';
	import { sharedQuery } from '$lib/search.svelte.js';

	const { data } = $props();

	const results = $derived(executeSearch(sharedQuery.query ?? '', data.allPieces));
</script>

<svelte:head>
	<title>🔎 {sharedQuery.query} | {data.config.title}</title>
</svelte:head>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={[{ label: 'Search: ' + (sharedQuery.query ?? ''), href: ['/search'] }]}
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
