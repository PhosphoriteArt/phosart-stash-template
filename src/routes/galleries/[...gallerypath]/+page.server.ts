import { filter, galleries } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';
import { getFeaturedPieces } from '$lib/featured';

export const load: PageServerLoad = async ({ params, parent }) => {
	const all = filter((await galleries())[params.gallerypath].pieces, undefined, { sorted: true });

	const { config } = await parent();

	return {
		...params,
		...getFeaturedPieces(all, config['featured-tags-gallery'] ?? [])
	};
};

export const entries: EntryGenerator = async () => {
	return Object.keys(await galleries()).map((gallerypath) => ({ gallerypath }));
};
