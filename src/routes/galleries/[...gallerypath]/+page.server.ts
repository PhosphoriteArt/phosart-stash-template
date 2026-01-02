import { galleries } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
    ...params,
    gallery: (await galleries())[params.gallerypath]
	};
};

export const entries: EntryGenerator = async () => {
	return Object.keys(await galleries()).map((gallerypath) => ({ gallerypath }));
};
