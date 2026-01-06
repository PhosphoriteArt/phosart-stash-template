<script lang="ts">
	import GalleryTile from '$lib/GalleryTile.svelte';
	import type { FolderElement, GalleryElement, GalleryTree } from '@phosart/common/util';
	import Tile from './Tile.svelte';
	import { qsearchObj } from './search.svelte';

	interface Props {
		tree: GalleryTree;
		path: string[];
		search?: string | null;
	}
	const { tree, path, search }: Props = $props();

	const folders = $derived(
		qsearchObj(
			search,
			Object.fromEntries(
				Object.entries(tree).filter((v): v is [string, FolderElement] => v[1].$type === 'folder')
			),
			(_, k) => k
		)
	);
	const galleries = $derived(
		qsearchObj(
			search,
			Object.fromEntries(
				Object.entries(tree).filter((v): v is [string, GalleryElement] => v[1].$type === 'gallery')
			),
			(_, k) => k
		)
	);
</script>

<div>
	<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each Object.entries(galleries) as [k, v] (k)}
			{@const galname = k.replace(/\.gallery$/, '')}
			<GalleryTile
				name={galname}
				gallery={v.data}
				href={['/galleries/[...gallerypath]', { gallerypath: v.fullpath }]}
			/>
		{/each}
	</div>
	<div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each Object.keys(folders) as k (k)}
			<div class="flex justify-center">
				<Tile
					href={['/tree/[...gallerypath]', { gallerypath: [...path, k].join('/') }]}
					title={k}
					class="items-center justify-center"
				>
					<i class="fa-solid fa-folder text-8xl"></i>
				</Tile>
			</div>
		{/each}
	</div>
</div>
