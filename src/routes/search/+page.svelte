<script lang="ts">
	import type { ArtPiece } from 'phosart-common/util';
	import { onMount, untrack } from 'svelte';
	import { debounce } from 'es-toolkit';
	import { page } from '$app/state';
	import Header from '$lib/Header.svelte';
	import { Gallery } from 'phosart-common';
	import { browser } from '$app/environment';

	const { data } = $props();

	let results: ArtPiece[] | null = $state(null);

	function doSearch(query: string) {
		if (!query) {
			results = [];
		}
		fetch('/api/search?q=' + encodeURIComponent(query))
			.then((res) => res.json())
			.then((result) => {
				results = result;
			});
	}

	const searchDebounced = debounce(doSearch, 250);

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		page.state.query;
		if (untrack(() => results !== null)) {
			searchDebounced(page.state.query ?? '');
		}
	});

	onMount(() => {
		doSearch(page.state.query ?? '');
	});
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
