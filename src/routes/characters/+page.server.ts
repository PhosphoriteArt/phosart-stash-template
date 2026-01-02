import { normalizeCharacter, type Character } from 'phosart-common/util';
import type { PageServerLoad } from './$types';
import { galleries, getAllCharacters } from 'phosart-common/server';
import { arrayToShuffled } from 'array-shuffle';
import { deduplicateBy } from '$lib/util';

export const load: PageServerLoad = async () => {
	const allCharacters = await getAllCharacters();

	const others = allCharacters.filter((v) => !v.info);

	const allPieces = Object.values(await galleries()).flatMap((g) => g.pieces);

	const othersWithGallery = others.map(
		(nc) =>
			[
				nc,
				arrayToShuffled(
					deduplicateBy(
						allPieces.filter((p) =>
							p.characters.map((ch) => normalizeCharacter(ch)).some((na) => na.name === nc.name)
						),
						(p) => p.slug
					)
				).slice(0, 4)
			] as const
	);

	return {
		characters: allCharacters.map((v) => v.info).filter((v): v is Character => !!v),
		others: othersWithGallery
	};
};
