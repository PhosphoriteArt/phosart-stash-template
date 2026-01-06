<script lang="ts">
	import GalleryTile from '$lib/GalleryTile.svelte';
	import Header from '$lib/Header.svelte';
	import { qsearch, sharedQuery } from '$lib/search.svelte.js';

	const { data } = $props();

	const search = $derived(qsearch(sharedQuery.query, Object.entries(data.tags), ([k]) => k));
</script>

<svelte:head>
	<title>Tags | {data.config.title}</title>
</svelte:head>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={[{ label: 'Tags', href: ['/tags'] }]}
/>

<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each search as [t, g] (t)}
		<GalleryTile name="#{t}" gallery={{ pieces: g }} href={['/tags/[tag]', { tag: t }]} />
	{/each}
</div>
