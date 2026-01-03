<script lang="ts">
	import { resolve } from '$app/paths';
	import GalleryTile from '$lib/GalleryTile.svelte';
	import Header from '$lib/Header.svelte';
	import { Image } from 'phosart-common';
	import type { Character } from 'phosart-common/util';

	const { data } = $props();
</script>

<svelte:head>
	<title>
		Characters | {data.config.title}
	</title>
</svelte:head>

<Header
	title={data.config.title}
	subtitle={data.config.subtitle}
	breadcrumb={[{ label: 'Characters', href: ['/characters'] }]}
/>

{#snippet MyCharacterTile(slug: string, character: Character)}
	<a
		href={resolve('/characters/[name]/[[from]]', { name: slug })}
		class="m-4 flex max-h-56 w-full cursor-pointer items-stretch overflow-hidden rounded-2xl bg-gray-800 p-4 transition-colors hover:bg-gray-600 active:bg-gray-500"
	>
		<div class="h-48 min-h-48 min-w-48 overflow-hidden rounded-l-2xl">
			<Image alt={character.picture.alt} picture={character.picture.thumbnail} />
		</div>
		<div class="flex grow flex-col overflow-hidden rounded-r-2xl bg-gray-700 p-4">
			<div class="mb-3 text-xl font-extralight italic">
				<span class="underline">{character.name}</span>
				<span class="mx-3">|</span>
				<span class="text-gray-400">{character.pronouns}</span>
			</div>
			<div class="overflow-y-auto">{character.description}</div>
		</div>
	</a>
{/snippet}

<div class="flex flex-col items-stretch">
	{#each data.characters as v (v.name)}
		{@render MyCharacterTile(v.name, v)}
	{/each}
</div>

<div class="mt-16 mb-4 flex w-full justify-center text-2xl font-light italic">
	Others' Characters
</div>

<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each data.others as [nc, gal] (nc)}
		<GalleryTile
			gallery={{ pieces: gal }}
			href={[
				'/characters/[name]/[[from]]',
				{
					name: nc.name,
					from: nc.from ?? undefined
				}
			]}
			name="{nc.name}{nc.from ? ` by ${nc.from}` : ''}"
		/>
	{/each}
</div>
