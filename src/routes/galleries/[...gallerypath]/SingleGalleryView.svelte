<script lang="ts">
	import { browser } from '$app/environment';
	import { galleryBreadcrumbs } from '$lib/Breadcrumbs.svelte';
	import Header from '$lib/Header.svelte';
	import { sharedQuery } from '$lib/search.svelte.js';
	import type { Unpromise } from '$lib/util';
	import { Gallery } from '@phosart/common';
	import { executeSearch } from '@phosart/common/util';
	import type { singleGalleryData } from './load';
	import type { LayoutServerData } from '../../$types';

	const { data, hideBreadcrumb }: { data: Unpromise<ReturnType<typeof singleGalleryData>> & LayoutServerData, hideBreadcrumb?: boolean } =
		$props();
</script>

<svelte:head>
	<title>
		{data.gallerypath
			.split('/')
			.at(-1)
			?.replace(/\.gallery$/, '') || 'Gallery'} | {data.config.title}
	</title>
</svelte:head>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={hideBreadcrumb ? undefined : galleryBreadcrumbs(data.gallerypath.split('/'))}
/>

{#if data.featured.length > 0}
	<div class="mt-16 mb-4 flex w-full justify-center text-2xl font-light italic">Featured</div>
	<div
		class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	>
		<Gallery
			{browser}
			pieces={sharedQuery.query ? executeSearch(sharedQuery.query, data.featured) : data.featured}
		/>
	</div>
	<div class="mt-16 mb-4 flex w-full justify-center text-2xl font-light italic"></div>
{/if}

<div
	class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
	<Gallery
		{browser}
		pieces={sharedQuery.query
			? executeSearch(sharedQuery.query, data.nonfeatured)
			: data.nonfeatured}
	/>
</div>
