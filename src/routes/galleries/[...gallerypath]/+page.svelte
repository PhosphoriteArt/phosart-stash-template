<script lang="ts">
	import SingleGalleryView from './SingleGalleryView.svelte';

	const { data } = $props();
</script>

<SingleGalleryView {data} />
