import { galleries } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';
import { asRecord } from '$lib/util';

export const load: PageServerLoad = async ({ params }) => {
	return {
		...params,
		piece: asRecord(
			Object.values(await galleries()).flatMap((g) => g.pieces),
			(p) => p.slug
		)[params.slug]
	};
};

export const entries: EntryGenerator = async () => {
	return [
		...new Set(
			Object.values(await galleries())
				.flatMap((g) => g.pieces)
				.map((p) => p.slug)
		)
	].map((slug) => ({ slug }));
};
