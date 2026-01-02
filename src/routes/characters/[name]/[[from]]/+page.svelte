<script lang="ts">
	import { browser } from '$app/environment';
	import Header from '$lib/Header.svelte';
	import { Gallery } from 'phosart-common';

	const { data } = $props();
</script>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={[
		{ label: 'Characters', href: ['/characters'] },
		{
			label: `${data.name}${data.from ? ' by ' + data.from : ''}`,
			href: ['/characters/[name]/[[from]]', { name: data.name, from: data.from }]
		}
	]}
/>

<div
	class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
	<Gallery {browser} pieces={data.piecesWithCharacter} />
</div>
