<script lang="ts" generics="T extends RouteId | Pathname">
	import { resolve } from '$app/paths';
	import type { Pathname, RouteId } from '$app/types';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title: string | Snippet;
		href?: Parameters<typeof resolve<T>>;
		onclick?: () => void;
		class?: string;
	}

	const { children, title, href, class: cls, onclick }: Props = $props();
</script>

{#snippet inner()}
	<div class="flex h-64 w-64 flex-wrap overflow-hidden rounded-2xl {cls ?? ''}">
		{@render children()}
	</div>
	<div class="nametag">
		<span>
			{#if typeof title === 'string'}
				{title}
			{:else}
				{@render title()}
			{/if}
		</span>
	</div>
{/snippet}

{#if href}
	<a {onclick} href={resolve<T>(...href)} class="tile">
		{@render inner()}
	</a>
{:else if onclick}
	<button {onclick} class="tile">
		{@render inner()}
	</button>
{:else}
	<span class="tile">
		{@render inner()}
	</span>
{/if}

<style lang="postcss">
	@reference '../routes/layout.css';

	.tile {
		@apply inline-flex flex-col overflow-hidden rounded-2xl bg-tile-bg p-2 select-none items-center;
		&:hover {
			@apply bg-tile-bg-hover;
			& .nametag {
				@apply bg-tile-nametag-bg-hover;
			}
		}

		&:active {
			& .nametag {
				@apply bg-tile-nametag-bg;
			}
		}
	}
	.nametag {
		@apply mx-3 my-1 mt-2 flex items-center justify-center rounded-2xl bg-tile-nametag-bg p-0.5 px-3;
	}
</style>
