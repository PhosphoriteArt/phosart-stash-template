import { galleries } from '@phosart/common/server';
import type { PageServerLoad, EntryGenerator } from './$types';
import { singleGalleryData } from './load';

export const load: PageServerLoad = async ({ params, parent }) => {
	return singleGalleryData(params.gallerypath, await parent());
};

export const entries: EntryGenerator = async () => {
	return Object.keys(await galleries()).map((gallerypath) => ({ gallerypath }));
};
