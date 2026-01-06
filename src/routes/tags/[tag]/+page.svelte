<script lang="ts">
	import { browser } from '$app/environment';
	import Header from '$lib/Header.svelte';
	import { sharedQuery } from '$lib/search.svelte.js';
	import { Gallery, OpengraphMeta } from '@phosart/common';
	import { executeSearch } from '@phosart/common/util';

	const { data } = $props();
</script>

<OpengraphMeta type="tag" resource={data.tag} setPageTitle siteName={data.config.title} />

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={[
		{ label: 'Tags', href: ['/tags'] },
		{ label: `#${data.tag}`, href: ['/tags/[tag]', { tag: data.tag }] }
	]}
/>

<div
	class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
	<Gallery
		{browser}
		pieces={sharedQuery.query
			? executeSearch(sharedQuery.query, data.piecesWithTag)
			: data.piecesWithTag}
	/>
</div>
