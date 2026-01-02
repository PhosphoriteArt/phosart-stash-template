<script lang="ts">
	import Header from '$lib/Header.svelte';

	const { data } = $props();
</script>

<Header title={data.config.title} subtitle={data.config.subtitle} />
