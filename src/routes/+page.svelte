<script lang="ts">
	import SingleGalleryView from './galleries/[...gallerypath]/SingleGalleryView.svelte';
	import MultiGalleryTree from './MultiGalleryTree.svelte';

	const { data } = $props();
</script>

{#if data.single}
	<SingleGalleryView hideBreadcrumb data={Object.assign({}, data, data.single!)} />
{:else}
	<MultiGalleryTree data={Object.assign({}, data, data.multi!)} />
{/if}
