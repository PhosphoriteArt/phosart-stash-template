import type { PageServerLoad, EntryGenerator } from './$types';
import { characters } from 'phosart-common/server';

export const load: PageServerLoad = async ({ params }) => {
	return {
		...params
	};
};

export const entries: EntryGenerator = async () => {
	return Object.keys(await characters()).map((name) => ({ name }));
};
