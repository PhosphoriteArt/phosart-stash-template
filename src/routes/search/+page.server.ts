import { galleries } from 'phosart-common/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		allPieces: Object.values(await galleries()).flatMap((g) => g.pieces)
	};
};
