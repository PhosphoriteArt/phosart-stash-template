import { galleries } from 'phosart-common/server';
import type { PageServerLoad } from './$types';
import type { ArtPiece } from 'phosart-common/util';
import { arrayToShuffled } from 'array-shuffle';
import { deduplicateBy } from '$lib/util';

export const load: PageServerLoad = async () => {
	// Create index [tag name => [list of pieces with that tag]]
	const allGalleries = Object.values(await galleries())
		.flatMap((g) => g.pieces)
		.flatMap((p) => p.tags.map((t) => [t, p] as const))
		.reduce<Record<string, ArtPiece[]>>(
			(acc, [t, p]) => ({ ...acc, [t]: deduplicateBy([...(acc[t] ?? []), p], (p) => p.slug) }),
			{}
		);

	// Pick just 4 for each tag to display with the below
	const randomSelection = Object.fromEntries(
		Object.entries(allGalleries).map(([k, v]) => [k, arrayToShuffled(v).slice(0, 4)])
	);

	return {
		// tag -> up to 4 images from that tag
		tags: randomSelection
	};
};
