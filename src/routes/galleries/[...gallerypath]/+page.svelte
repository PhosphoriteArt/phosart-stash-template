<script lang="ts">
	import { browser } from '$app/environment';
	import { galleryBreadcrumbs } from '$lib/Breadcrumbs.svelte';
	import Header from '$lib/Header.svelte';
	import { Gallery } from 'phosart-common';

	const { data } = $props();
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
	breadcrumb={galleryBreadcrumbs(data.gallerypath.split('/'))}
/>

<div
	class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
	<Gallery {browser} pieces={data.gallery.pieces} />
</div>
