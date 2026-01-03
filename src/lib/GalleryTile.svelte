<script lang="ts" generics="T extends RouteId | Pathname">
	import { GalleryPreview } from 'phosart-common';
	import type { Gallery } from 'phosart-common/util';
	import Tile from './Tile.svelte';
	import type { RouteId } from '$app/types';
	import type { Pathname } from '$app/types';
	import type { resolve } from '$app/paths';

	interface Props {
		gallery: Gallery;
		name: string;
		href: Parameters<typeof resolve<T>>;
		px?: number;
	}

	const { name, gallery, href, px = 256 }: Props = $props();

	const pieces = $derived(gallery.pieces.slice(0, 4));
</script>

{#if pieces[0]}
	<div class="flex justify-center">
		<Tile {href} title={name}>
			<GalleryPreview cssSize="{px}px" {gallery} />
		</Tile>
	</div>
{/if}
