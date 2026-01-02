<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import {
		normalizeCharacter,
		setLibraryConfig,
		useArtistsContext,
		useCharacterContext
	} from 'phosart-common/util';
	import Card from '$lib/ArtTile.svelte';
	import { goto as go } from '$app/navigation';
	import { page } from '$app/state';

	import '@fortawesome/fontawesome-free/css/all.min.css';

	let { children, data } = $props();

	let search = $state('');

	const id = $props.id();

	// svelte-ignore state_referenced_locally
	useCharacterContext(data.characters);
	// svelte-ignore state_referenced_locally
	useArtistsContext(data.artists);
	setLibraryConfig({
		gallery: { DefaultPieceComponent: Card },
		modal: {
			chipOptionsByType: {
				artist: { action: { makeHref: (a) => resolve('/artists/[name]', { name: a.name }) } },
				character: {
					action: {
						makeHref: (c) => resolve('/characters/[name]', { name: normalizeCharacter(c).name })
					}
				},
				permalink: {
					action: { makeHref: (piece) => resolve('/piece/[slug]', { slug: piece.slug }) }
				},
				tag: { action: { makeHref: (tag) => resolve('/tags/[tag]', { tag }) } }
			}
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<nav class="mx-2 mt-4 flex items-center justify-around font-light">
	<a class="hover:underline" href={resolve('/')}>Home</a>
	{#if data.hasCharacters}
		<a class="hover:underline" href={resolve('/characters')}>Characters</a>
	{/if}
	{#if data.hasArtists}
		<a class="hover:underline" href={resolve('/artists')}>Artists</a>
	{/if}
	{#if data.hasTags}
		<a class="hover:underline" href={resolve('/tags')}>Tags</a>
	{/if}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			go(resolve('/search'), { state: { query: search } });
			search = '';
		}}
		class="flex items-stretch gap-x-2"
	>
		<div class="flex items-center">
			<label for="search-{id}"><i class="fa-solid fa-search text-gray-400"></i></label>
		</div>
		<input
			id="search-{id}"
			placeholder={page.state.query ?? 'Search'}
			class="border-0 border-b border-b-gray-700 bg-transparent outline-none"
			type="text"
			bind:value={search}
		/>
		<div class="flex flex-col justify-stretch">
			<button
				type="submit"
				class:invisible={!search}
				title="Execute"
				class="h-full rounded-2xl {search ? 'cursor-pointer hover:bg-[#fff3]' : ''}"
			>
				<i class="fa-solid fa-chevron-right text-gray-400"></i>
			</button>
		</div>
	</form>
</nav>
<div class="flex w-full justify-center">
	<div class="container">
		{@render children()}
	</div>
</div>
<div class="my-4 flex grow flex-col items-center justify-end text-gray-500">
	&copy; {data.config.attribution ?? ''}
	{new Date().getFullYear()}
</div>
