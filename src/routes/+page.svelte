<script lang="ts">
	import DirectoryList from '$lib/DirectoryList.svelte';
	import Header from '$lib/Header.svelte';
	import { sharedQuery } from '$lib/search.svelte.js';

	const { data } = $props();
</script>

<svelte:head>
	<title>Home | {data.config.title}</title>
</svelte:head>

<Header title={data.config.title} subtitle={data.config.subtitle} breadcrumb={[]} />

<DirectoryList tree={data.galleryTree} path={[]} search={sharedQuery.query} />
