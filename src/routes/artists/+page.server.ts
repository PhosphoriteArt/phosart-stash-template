import { galleries, getAllArtists } from 'phosart-common/server';
import type { PageServerLoad } from './$types';
import { arrayToShuffled } from 'array-shuffle';
import { normalizeArtist } from 'phosart-common/util';
import { deduplicateBy } from '$lib/util';

export const load: PageServerLoad = async () => {
	const allArtists = await getAllArtists();

	const allPieces = Object.values(await galleries()).flatMap((g) => g.pieces);

	const withGalleries = allArtists.map(
		(artist) =>
			[
				artist,
				arrayToShuffled(
					deduplicateBy(
						allPieces.filter((p) =>
							normalizeArtist(p.artist).some((na) => na.name === artist.name)
						),
						(p) => p.slug
					)
				).slice(0, 4)
			] as const
	);

	return {
		artists: withGalleries
	};
};
