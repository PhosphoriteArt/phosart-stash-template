import { allPieces, getPieceBySlug } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const p = await getPieceBySlug(params.slug);
	if (!p) {
		return error(404, `Piece with slug ${params.slug} not found`)
	}
	return {
		...params,
		piece: p
	};
};

export const entries: EntryGenerator = async () => {
	return Object.values(await allPieces()).map((p) => ({ slug: p.slug }));
};
