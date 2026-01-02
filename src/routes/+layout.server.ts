import {
	artists,
	characters,
	galleries,
	getAllArtists,
	getAllCharacters,
	readThemeConfig,
	readThemeSchema
} from 'phosart-common/server';
import type { LayoutServerLoad } from './$types';
import type { ThemeSchema } from '../data/generated-schema';

export const load: LayoutServerLoad = async () => {
	const config = await readThemeConfig(await readThemeSchema<ThemeSchema>());
	return {
		config,
		hasCharacters: (await getAllCharacters()).length > 0,
		hasTags:
			Object.values(await galleries())
				.flatMap((g) => g.pieces)
				.flatMap((p) => p.tags).length > 0,
		hasContent: Object.values(await galleries()).flatMap((g) => g.pieces).length > 0,
		// Intentional; if it's just the site owner, don't list.
    hasArtists: (await getAllArtists()).length > 1,
    characters: await characters(),
    artists: await artists()
	};
};
