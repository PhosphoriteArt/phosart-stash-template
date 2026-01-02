<script lang="ts" generics="T extends RouteId | Pathname">
	import { Image } from 'phosart-common';
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
	{@const topw = pieces[1] ? 'calc(var(--width) / 2)' : 'var(--width)'}
	{@const toph = pieces[2] ? 'calc(var(--width) / 2)' : 'var(--width)'}
	{@const botw = pieces[3] ? 'calc(var(--width) / 2)' : 'var(--width)'}
	{@const both = 'calc(var(--width) / 2)'}
	<div class="flex justify-center" style="--width: {px}px">
		<Tile {href} title={name}>
			<div style="height: {toph}; width: {topw}" class="imgcontainer" class:square={topw === toph}>
				<div><Image alt={pieces[0].alt} picture={pieces[0].image.thumbnail} /></div>
			</div>
			{#if pieces[1]}
				<div
					style="height: {toph}; width: {topw}"
					class="imgcontainer"
					class:square={topw === toph}
				>
					<div><Image alt={pieces[1].alt} picture={pieces[1].image.thumbnail} /></div>
				</div>
			{/if}
			{#if pieces[2]}
				<div
					style="height: {both}; width: {botw}"
					class="imgcontainer"
					class:square={botw === both}
				>
					<div><Image alt={pieces[2].alt} picture={pieces[2].image.thumbnail} /></div>
				</div>
			{/if}
			{#if pieces[3]}
				<div
					style="height: {both}; width: {botw}"
					class="imgcontainer"
					class:square={botw === both}
				>
					<div><Image alt={pieces[3].alt} picture={pieces[3].image.thumbnail} /></div>
				</div>
			{/if}
		</Tile>
	</div>
{/if}

<style lang="postcss">
	@reference 'tailwindcss';

	.imgcontainer {
		overflow: hidden;
		@apply flex items-center justify-center;

		&:not(.square) > div {
			width: var(--width);
			height: var(--width);
			max-width: var(--width);
			max-height: var(--width);
			min-width: var(--width);
			min-height: var(--width);
		}
	}
</style>
