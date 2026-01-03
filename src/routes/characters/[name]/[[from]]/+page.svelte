<script lang="ts">
	import { browser } from '$app/environment';
	import Header from '$lib/Header.svelte';
	import { Gallery, OpengraphMeta } from 'phosart-common';

	const { data } = $props();
</script>

<OpengraphMeta
	type="character"
	resource={data.character}
	siteName={data.config.title}
	setPageTitle
/>

<svelte:head>
	{#if !data.isMyCharacter}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

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
{#if data.piecesWithCharacter.featured.length > 0}
	<div class="mt-16 mb-4 flex w-full justify-center text-2xl font-light italic">Featured</div>
	<div
		class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	>
		<Gallery {browser} pieces={data.piecesWithCharacter.featured} />
	</div>
	<div class="mt-16 mb-4 flex w-full justify-center text-2xl font-light italic"></div>
{/if}

<div
	class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
	<Gallery {browser} pieces={data.piecesWithCharacter.nonfeatured} />
</div>
