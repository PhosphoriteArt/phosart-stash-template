import { normalizeCharacter } from 'phosart-common/util';
import type { PageServerLoad, EntryGenerator } from './$types';
import { allPieces, characters, filter, getAllCharacters } from 'phosart-common/server';

export const load: PageServerLoad = async ({ params }) => {
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

	return {
		...params,
		character: normalizedCharacter,
		piecesWithCharacter: filtered,
		isMyCharacter: !!normalizedCharacter.info
	};
};

export const entries: EntryGenerator = async () => {
	return (await getAllCharacters()).map((ch) => ({ name: ch.name, from: ch.name }));
};
