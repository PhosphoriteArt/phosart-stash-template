import { normalizeArtist, normalizeCharacter, type ArtPiece } from 'phosart-common/util';
import fz from 'fuzzysort';
import { galleries } from 'phosart-common/server';
import { asRecord } from '$lib/util';

export async function executeSearch(query: string): Promise<ArtPiece[]> {
	const allPieces = asRecord(
		Object.values(await galleries()).flatMap((g) => g.pieces),
		(p) => p.slug
	);

	const searchObj = Object.values(allPieces).map((p) => ({
		name: p.name,
		description: p.description,
		alt: p.alt,
		tags: p.tags.join(', '),
		characters: p.characters
			.map((ch) => normalizeCharacter(ch))
			.map((ch) => `${ch.name} ${ch.from}`),
		artists: normalizeArtist(p.artist)
			.map((a) => a.name)
			.join(', '),
		slug: p.slug
	}));

	const results = fz.go(query, searchObj, {
		keys: ['name', 'description', 'alt', 'tags', 'characters', 'artists'],
		threshold: 0.3
	});

	return results.map((res) => allPieces[res.obj.slug]);
}
