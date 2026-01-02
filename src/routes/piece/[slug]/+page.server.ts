import { galleries } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		...params
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
