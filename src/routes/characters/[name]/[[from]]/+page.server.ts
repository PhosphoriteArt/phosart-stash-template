import { normalizeCharacter } from 'phosart-common/util';
import type { PageServerLoad, EntryGenerator } from './$types';
import { allPieces, characters, filter, getAllCharacters } from 'phosart-common/server';
import { getFeaturedPieces } from '$lib/featured';

export const load: PageServerLoad = async ({ params, parent }) => {
	const allCharacters = await characters();

	const normalizedCharacter = normalizeCharacter(
		params.from ? { from: params.from, name: params.name } : params.name,
		allCharacters
	);
	const filtered = filter(
		await allPieces(),
		{ type: 'character', resource: normalizedCharacter },
		{ sorted: true }
	);

	const { config } = await parent();

	return {
		...params,
		character: normalizedCharacter,
		piecesWithCharacter: getFeaturedPieces(filtered, config['featured-tags-characters'] ?? []),
		isMyCharacter: !!normalizedCharacter.info
	};
};

export const entries: EntryGenerator = async () => {
	return (await getAllCharacters()).map((ch) => ({ name: ch.name, from: ch.name }));
};
