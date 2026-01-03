import { galleries } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';
import { asTree } from '$lib/tree';
import { pathView } from 'phosart-common/util';

export const load: PageServerLoad = async ({ params }) => {
	return {
		...params,
		galleryTree: pathView(
			asTree(await galleries(), /* pruneGalleries = */ 4),
			params.gallerypath.split('/')
		)
	};
};

export const entries: EntryGenerator = async () => {
	return [
		...new Set(
			Object.keys(await galleries()).flatMap((path) => {
				// get all subpaths
				const split = path.split('/');
				const subpaths: string[] = [];
				// Exclude final element here (only folders)
				for (let i = 0; i < split.length; i++) {
					subpaths.push(split.slice(0, i).join('/'));
				}
				return subpaths;
			})
		)
	].map((gallerypath) => ({ gallerypath }));
};
