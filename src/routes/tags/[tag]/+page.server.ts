import { allPieces, filter } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		tag: params.tag,
		piecesWithTag: filter(await allPieces(), { type: 'tag', resource: params.tag })
	};
};

export const entries: EntryGenerator = async () => {
	return Object.values(await allPieces())
		.flatMap((p) => p.tags)
		.map((tag) => ({ tag }));
};
