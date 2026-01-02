<script lang="ts">
	import { galleryBreadcrumbs } from '$lib/Breadcrumbs.svelte';
	import DirectoryList from '$lib/DirectoryList.svelte';
	import Header from '$lib/Header.svelte';

	const { data } = $props();
	const path = $derived(data.gallerypath.split('/'));
</script>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={galleryBreadcrumbs(path)}
/>

<DirectoryList tree={data.galleryTree} {path} />
