<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import {
		nsfwConsented,
		setLibraryConfig,
		sveltekitAbsolutePath,
		useArtistsContext,
		useCharacterContext
	} from '@phosart/common/util';
	import Card from '$lib/ArtTile.svelte';
	import { goto as go, onNavigate, replaceState } from '$app/navigation';

	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { sharedQuery } from '$lib/search.svelte.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Modal } from '@phosart/common';

	let { children, data } = $props();

	const id = $props.id();

	let once = false;

	let confirmConsent = $state(false);

	onMount(() => {
		window.addEventListener('keydown', (kev) => {
			if (
				(kev.metaKey || kev.ctrlKey) &&
				kev.code === 'KeyR' &&
				!page.route.id?.includes('search')
			) {
				sharedQuery.query = '';
			}
		});
	});

	onNavigate((nv) => {
		if (!nv.to?.route.id?.includes('search')) {
			sharedQuery.query = '';
		}
	});

	$effect(() => {
		if (browser) {
			const url = new URL(window.location.href);
			if (!sharedQuery.query && url.search && !once) {
				const q = url.searchParams.get('q');
				if (q) {
					sharedQuery.query = q;
				}
			}
			once = true;
			if ((sharedQuery.query || '') !== (url.searchParams.get('q') || '')) {
				url.searchParams.set('q', sharedQuery.query);
				if (!sharedQuery.query) {
					url.searchParams.delete('q');
				}
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				replaceState(url, {});
			}
		}
	});

	// svelte-ignore state_referenced_locally
	useCharacterContext(data.characters);
	// svelte-ignore state_referenced_locally
	useArtistsContext(data.artists);
	// svelte-ignore state_referenced_locally
	setLibraryConfig({
		siteName: data.config?.title ?? 'My Art Stash',
		gallery: { DefaultPieceComponent: Card },
		modal: {
			chipOptionsByType: {
				artist: { action: { makeHref: (a) => resolve('/artists/[name]', { name: a.name }) } },
				character: {
					action: {
						makeHref: (c) => resolve('/characters/[name]', { name: c.name })
					}
				},
				permalink: {
					action: { makeHref: (piece) => resolve('/piece/[slug]', { slug: piece.slug }) }
				},
				tag: { action: { makeHref: (tag) => resolve('/tags/[tag]', { tag }) } }
			}
		},
		defaultTransformSrc: sveltekitAbsolutePath(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(s) => resolve(s as any),
			() => page.url.pathname
		),
		getPage: () => page.url.pathname,
		origin: data.origin
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<nav class="mx-2 mt-4 flex items-center justify-around gap-3 font-light">
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
			go(resolve('/search'), { state: { query: sharedQuery.query } });
		}}
		class="flex items-stretch gap-x-2"
	>
		<div class="flex items-center">
			<label for="search-{id}"><i class="fa-solid fa-search text-understated-400"></i></label>
		</div>
		<input
			id="search-{id}"
			placeholder={sharedQuery.query ?? 'Search'}
			class="border-0 border-b border-b-understated-border bg-transparent outline-none"
			type="text"
			bind:value={sharedQuery.query}
		/>
		<div class="flex flex-col justify-stretch">
			<button
				type="submit"
				class:invisible={!sharedQuery.query}
				title="Execute"
				class="h-full rounded-2xl {sharedQuery.query
					? 'cursor-pointer hover:bg-understated-highlight'
					: ''}"
			>
				<i class="fa-solid fa-chevron-right text-understated-text"></i>
			</button>
		</div>
	</form>
</nav>
<div class="flex w-full justify-center">
	<div class="container p-4">
		{@render children()}
	</div>
</div>
<div class="my-4 flex grow flex-col items-center justify-end text-attribution">
	&copy; {data.config.attribution ?? ''}
	{new Date().getFullYear()}
</div>

<Modal
	open={data.hasAnyNsfw && !nsfwConsented.consented}
	onclose={() => {
		confirmConsent = false;
	}}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="flex h-full w-full items-center justify-center"
		onclick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		}}
		onkeydown={(e) => {
			if (e.code === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
		}}
	>
		<div
			class="flex min-h-128 min-w-128 flex-col items-center justify-center overflow-hidden rounded-3xl border-4 border-amber-800 bg-gray-950 p-4 text-white select-none"
		>
			<h1 class="mb-4 text-2xl">This site contains adult content.</h1>
			<div class="mb-8">
				Please confirm that you are a legal adult (over 18 years old) before accessing this site.
			</div>

			<button
				class="mb-8 flex items-center justify-center overflow-hidden rounded-lg bg-green-800 p-4 px-8 text-lg hover:bg-green-700 active:bg-green-900"
				onclick={() => {
					window.location.replace('https://google.com/');
				}}
			>
				I am under 18
			</button>
			<button
				class="flex items-center justify-center overflow-hidden rounded-lg bg-amber-800 p-4 px-8 text-xs hover:bg-amber-700 active:bg-amber-900"
				onclick={() => {
					if (!confirmConsent) {
						confirmConsent = true;
					} else {
						nsfwConsented.consented = true;
					}
				}}
			>
				{#if !confirmConsent}
					I am over 18 years old and agree to potentially seeing adult content
				{:else}
					Click again to confirm that you are over 18 years old
				{/if}
			</button>
		</div>
	</div>
</Modal>
