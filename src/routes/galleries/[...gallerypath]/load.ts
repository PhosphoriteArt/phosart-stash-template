import { filter, galleries } from '@phosart/common/server';
import { getFeaturedPieces } from '$lib/featured';
import type { LayoutServerData } from '../../$types';

export async function singleGalleryData(galleryPath: string, parent: LayoutServerData) {
	const all = filter((await galleries())[galleryPath].pieces, undefined, { sorted: true });

	const { config } = parent;

	return {
		gallerypath: galleryPath,
		...getFeaturedPieces(all, config['featured-tags-gallery'] ?? [])
	};
}
