<script lang="ts">
	import { galleryBreadcrumbs } from '$lib/Breadcrumbs.svelte';
	import DirectoryList from '$lib/DirectoryList.svelte';
	import Header from '$lib/Header.svelte';
	import { sharedQuery } from '$lib/search.svelte.js';

	const { data } = $props();
	const path = $derived(data.gallerypath.split('/'));
</script>

<svelte:head>
	<title>/{path.join('/')} | {data.config.title}</title>
</svelte:head>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={galleryBreadcrumbs(path)}
/>

<DirectoryList tree={data.galleryTree} {path} search={sharedQuery.query} />
