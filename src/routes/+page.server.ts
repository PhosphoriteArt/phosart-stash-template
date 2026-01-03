import { galleries } from 'phosart-common/server';
import type { PageServerLoad } from './$types';
import { pathView } from 'phosart-common/util';
import { asTree } from '$lib/tree';

export const load: PageServerLoad = async () => {
	return {
		galleryTree: pathView(asTree(await galleries(), /* pruneGalleries = */ 4), [])
	};
};
