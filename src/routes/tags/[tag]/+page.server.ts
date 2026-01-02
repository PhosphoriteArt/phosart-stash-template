import { galleries } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';
import { deduplicateBy } from '$lib/util';

export const load: PageServerLoad = async ({ params }) => {
	return {
		tag: params.tag,
		piecesWithTag: deduplicateBy(
			Object.values(await galleries())
				.flatMap((p) => p.pieces)
				.filter((p) => p.tags.includes(params.tag)),
			(p) => p.slug
		)
	};
};

export const entries: EntryGenerator = async () => {
	return [
		...new Set(
			Object.values(await galleries())
				.flatMap((g) => g.pieces)
				.flatMap((p) => p.tags)
		)
	].map((tag) => ({ tag }));
};
