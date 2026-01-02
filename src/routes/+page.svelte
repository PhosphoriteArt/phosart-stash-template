<script lang="ts">
	import DirectoryList from '$lib/DirectoryList.svelte';
	import Header from '$lib/Header.svelte';

	const { data } = $props();
</script>

<Header title={data.config.title} subtitle={data.config.subtitle} breadcrumb={[]} />

<DirectoryList tree={data.galleryTree} path={[]} />
