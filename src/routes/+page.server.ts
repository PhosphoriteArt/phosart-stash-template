import { galleries } from '@phosart/common/server';
import type { PageServerLoad } from './$types';
import { multiGalleryTreeData } from './load.server';
import { singleGalleryData } from './galleries/[...gallerypath]/load';

export const load: PageServerLoad = async ({ parent }) => {
	const gal = Object.keys(await galleries());
	if (gal.length === 1) {
		return { single: await singleGalleryData(gal[0], await parent()) };
	}
	return { multi: await multiGalleryTreeData() };
};
