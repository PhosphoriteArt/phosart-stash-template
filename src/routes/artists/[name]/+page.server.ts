import { artists, galleries } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';
import { deduplicateBy } from '$lib/util';
import { normalizeArtist } from 'phosart-common/util';

export const load: PageServerLoad = async ({ params }) => {
	const allPieces = deduplicateBy(
		Object.values(await galleries()).flatMap((g) => g.pieces),
		(p) => p.slug
	);

	return {
		...params,
		piecesWithArtist: allPieces.filter((p) =>
			normalizeArtist(p.artist).some((a) => a.name === params.name)
		)
	};
};

export const entries: EntryGenerator = async () => {
	return Object.keys(await artists()).map((name) => ({ name }));
};
