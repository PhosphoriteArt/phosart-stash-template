import { allPieces, filter, getAllArtists } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';
import { normalizeArtist } from 'phosart-common/util';

export const load: PageServerLoad = async ({ params }) => {
	return {
		...params,
		piecesWithArtist: filter(await allPieces(), {
			type: 'artist',
			resource: normalizeArtist(params.name)[0]
		})
	};
};

export const entries: EntryGenerator = async () => {
	return (await getAllArtists()).map((na) => ({ name: na.name }));
};
