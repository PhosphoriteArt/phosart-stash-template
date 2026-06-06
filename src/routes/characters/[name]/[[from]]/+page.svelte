<script lang="ts">
	import { browser } from '$app/environment';
	import Header from '$lib/Header.svelte';
	import { sharedQuery } from '$lib/search.svelte.js';
	import { Gallery, Image, OpengraphMeta } from '@phosart/common';
	import { executeSearch, markdown } from '@phosart/common/util';

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

{#if data.character.info}
<div>
	<div class="my-8 flex">
		<div class="mr-2 h-128 w-128 shrink-0 max-xl:h-64 max-xl:w-64">
			<Image picture={data.character.info.picture.full} alt={data.character.info.picture.alt} />
		</div>
		<div class="flex grow flex-col items-stretch">
			<div class="border-surface-600-400 flex items-center gap-3 border-b pb-3">
				<div class="pb-2 text-6xl font-extralight max-xl:text-3xl">
					{data.character.info.name}
				</div>
				<div
					class="px-2 pb-2 text-6xl font-extralight max-xl:text-3xl"
					style="transform: scaleX(0.1);"
				>
					|
				</div>
				<div class="text-surface-800-200 pt-1 pb-2 text-xl font-light">
					{data.character.info.pronouns}
				</div>
			</div>
			{#if data.character.info.short_description}
				<div
					class="border-l-primary-200-800 mx-3 mt-3 border-l-3 pl-3 text-xl font-extralight italic max-xl:text-lg"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html markdown(data.character.info.short_description)}
				</div>
			{/if}
			<div class="mx-3 mt-3 max-h-80 min-w-0 shrink overflow-x-auto overflow-y-scroll">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html markdown(data.character.info.description)}
			</div>
		</div>
	</div>
</div>
{/if}

{#if data.piecesWithCharacter.featured.length > 0}
	<div class="mt-16 mb-4 flex w-full justify-center text-2xl font-light italic">Featured</div>
	<div
		class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	>
		<Gallery
			{browser}
			pieces={sharedQuery.query
				? executeSearch(sharedQuery.query, data.piecesWithCharacter.featured)
				: data.piecesWithCharacter.featured}
		/>
	</div>
	<div class="mt-16 mb-4 flex w-full justify-center text-2xl font-light italic"></div>
{/if}

<div
	class="grid grid-cols-1 items-stretch justify-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
	<Gallery
		{browser}
		pieces={sharedQuery.query
			? executeSearch(sharedQuery.query, data.piecesWithCharacter.nonfeatured)
			: data.piecesWithCharacter.nonfeatured}
	/>
</div>
