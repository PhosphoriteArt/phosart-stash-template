<script lang="ts">
	import { browser } from '$app/environment';
	import Header from '$lib/Header.svelte';
	import { Gallery } from 'phosart-common';

	const { data } = $props();
</script>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={[
		{ label: 'Artists', href: ['/artists'] },
		{ label: `@${data.name}`, href: ['/artists/[name]', { name: data.name }] }
	]}
/>

{#if data.piecesWithArtist.featured.length > 0}
	<div class="mt-16 mb-4 flex w-full justify-center text-2xl font-light italic">Featured</div>
	<div
		class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	>
		<Gallery {browser} pieces={data.piecesWithArtist.featured} />
	</div>
	<div class="mt-16 mb-4 flex w-full justify-center text-2xl font-light italic"></div>
{/if}

<div
	class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
	<Gallery {browser} pieces={data.piecesWithArtist.nonfeatured} />
</div>
