<script lang="ts">
	import GalleryTile from '$lib/GalleryTile.svelte';
	import Header from '$lib/Header.svelte';
	import { qsearch, sharedQuery } from '$lib/search.svelte.js';

	const { data } = $props();

	const foundArtists = $derived(qsearch(sharedQuery.query, data.artists, ([na]) => na.name));
</script>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={[{ label: 'Artists', href: ['/artists'] }]}
/>

<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each foundArtists as [na, gal] (na)}
		<GalleryTile
			gallery={{ pieces: gal }}
			href={[
				'/artists/[name]',
				{
					name: na.name
				}
			]}
			name="@{na.name}"
		/>
	{/each}
</div>
