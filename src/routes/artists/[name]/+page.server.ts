import { allPieces, filter, getAllArtists } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';
import { normalizeArtist } from 'phosart-common/util';
import { getFeaturedPieces } from '$lib/featured';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { config } = await parent();
	return {
		...params,
		piecesWithArtist: getFeaturedPieces(
			filter(await allPieces(), {
				type: 'artist',
				resource: normalizeArtist(params.name)[0]
			}),
			config['featured-tags-artist'] ?? []
		)
	};
};

export const entries: EntryGenerator = async () => {
	return (await getAllArtists()).map((na) => ({ name: na.name }));
};
