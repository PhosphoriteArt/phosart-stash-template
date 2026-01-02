import { galleries } from 'phosart-common/server';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		tag: params.tag
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
