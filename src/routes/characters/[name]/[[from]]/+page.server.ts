import { deduplicateBy } from '$lib/util';
import { normalizeCharacter } from 'phosart-common/util';
import type { PageServerLoad, EntryGenerator } from './$types';
import { characters, galleries } from 'phosart-common/server';

export const load: PageServerLoad = async ({ params }) => {
	const allPieces = deduplicateBy(
		Object.values(await galleries()).flatMap((g) => g.pieces),
		(p) => p.slug
	);

	const allCharacters = await characters();

	return {
		...params,
		character: normalizeCharacter(
			params.from ? { from: params.from, name: params.name } : params.name,
			allCharacters
		),
		piecesWithCharacter: allPieces.filter((p) =>
			p.characters
				.map((ch) => normalizeCharacter(ch))
				.some(
					(ch) => ch.name === params.name && (ch.from === params.from || (!ch.from && !params.from))
				)
		)
	};
};

export const entries: EntryGenerator = async () => {
	return Object.keys(await characters()).map((name) => ({ name }));
};
