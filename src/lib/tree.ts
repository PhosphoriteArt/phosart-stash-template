import { arrayToShuffled } from 'array-shuffle';
import type { GalleryCache } from 'phosart-common/server';
import type { Gallery } from 'phosart-common/util';

export type TreeElement =
	| { $type: 'folder'; data: GalleryTree }
	| { $type: 'gallery'; data: Gallery };

export type GalleryTree = {
	[element: string]: TreeElement;
};

export function asTree(cache: GalleryCache, pruneGalleries?: number): GalleryTree {
	const paths: [string, Gallery][] = Object.entries(cache);
	const tree: TreeElement = { $type: 'folder', data: {} };
	for (const [path, gallery] of paths) {
		let cur = tree;
		const segments = path.split('/');
		const dir = segments.slice(0, -1);
		for (const segment of dir) {
			const next = tree.data[segment];
			if (next.$type !== 'folder') {
				throw new Error('Somehow found gallery + folder with same name??');
			}
			cur = next;
		}
		cur.data[segments.at(-1)!] = {
			$type: 'gallery',
			data: {
				pieces: pruneGalleries
					? arrayToShuffled(gallery.pieces).slice(0, pruneGalleries)
					: gallery.pieces
			}
		};
	}

	return tree.data;
}

export function pathView(tree: GalleryTree, path: string[]): GalleryTree {
	let cur: TreeElement = { $type: 'folder', data: tree };
	// Go to path
	for (let i = 0; i < path.length; i++) {
		const el = path[i];
		const next: TreeElement = cur.data[el];
		if (!next) {
			return {};
		}
		if (next.$type !== 'folder') {
			return {};
		}
		cur = next;
	}

	// Prune deeper levels
	for (const [k, el] of Object.entries(cur.data)) {
		if (el.$type === 'folder') {
			cur.data[k] = { $type: 'folder', data: {} };
		}
	}
	return cur.data;
}
