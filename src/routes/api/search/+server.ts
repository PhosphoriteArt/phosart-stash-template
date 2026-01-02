import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeSearch } from './search';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q');
	if (!query) {
		return json([]);
	}

	return json(await executeSearch(query));
};
