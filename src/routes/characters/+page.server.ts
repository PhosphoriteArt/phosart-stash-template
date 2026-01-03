import { type Character } from 'phosart-common/util';
import type { PageServerLoad } from './$types';
import { allPieces, filter, getAllCharacters } from 'phosart-common/server';
import { arrayToShuffled } from 'array-shuffle';

export const load: PageServerLoad = async () => {
	const allCharacters = await getAllCharacters();

	const others = allCharacters.filter((v) => !v.info);

	const all = Object.values(await allPieces());

	const othersWithGallery = others.map(
		(nc) =>
			[nc, arrayToShuffled(filter(all, { type: 'character', resource: nc })).slice(0, 4)] as const
	);

	return {
		characters: allCharacters.map((v) => v.info).filter((v): v is Character => !!v),
		others: othersWithGallery
	};
};
