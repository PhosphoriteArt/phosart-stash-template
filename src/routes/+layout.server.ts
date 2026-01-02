import { artists, characters, galleries } from 'phosart-common/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		hasCharacters: Object.keys(await characters()).length > 0,
		hasTags:
			Object.values(await galleries())
				.flatMap((g) => g.pieces)
				.flatMap((p) => p.tags).length > 0,
		hasContent: Object.values(await galleries()).flatMap((g) => g.pieces).length > 0,
		// Intentional; if it's just the site owner, don't list.
		hasArtists: Object.keys(await artists()).length > 1
	};
};
