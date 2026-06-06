import { galleries } from '@phosart/common/server';
import { pathView } from '@phosart/common/util';
import { asTree } from '$lib/tree';

export async function multiGalleryTreeData() {
	return {
		galleryTree: pathView(asTree(await galleries(), /* pruneGalleries = */ 4), [])
	};
}
