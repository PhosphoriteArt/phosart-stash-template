import { galleries } from 'phosart-common/server';
import type { PageServerLoad } from './$types';
import { asTree, pathView } from '$lib/tree';

export const load: PageServerLoad = async () => {
	return {
		galleryTree: pathView(asTree(await galleries(), /* pruneGalleries = */ 4), [])
	};
};
