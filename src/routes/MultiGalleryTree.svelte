<script lang="ts">
	import DirectoryList from '$lib/DirectoryList.svelte';
	import Header from '$lib/Header.svelte';
	import { sharedQuery } from '$lib/search.svelte.js';
	import type { Unpromise } from '$lib/util';
	import type { LayoutServerData } from './$types';
	import type { multiGalleryTreeData } from './load.server';

	const { data }: { data: Unpromise<ReturnType<typeof multiGalleryTreeData>> & LayoutServerData } =
		$props();
</script>

<svelte:head>
	<title>Home | {data.config.title}</title>
</svelte:head>

<Header title={data.config.title} subtitle={data.config.subtitle} breadcrumb={[]} />

<DirectoryList tree={data.galleryTree} path={[]} search={sharedQuery.query} />
