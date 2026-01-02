<script lang="ts" module>
	export interface Breadcrumb<T extends RouteId | Pathname = RouteId | Pathname> {
		href: Parameters<typeof resolve<T>>;
		label: string;
	}

	export function galleryBreadcrumbs(
		galleryPath: string[]
	): Breadcrumb<'/tree/[...gallerypath]'>[] {
		return galleryPath.map((p) => ({
			label: p.replace(/\.gallery$/, ''),
			href: ['/tree/[...gallerypath]', { gallerypath: p }]
		}));
	}
</script>

<script lang="ts" generics="T extends RouteId | Pathname">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import type { RouteId } from '$app/types';

	interface Props {
		path: Breadcrumb<T>[];
	}

	const { path }: Props = $props();
</script>

<nav
	class="mt-4 mb-8 flex w-full justify-center text-lg font-light select-none"
	aria-label="Breadcrumb"
>
	<div class="flex flex-wrap items-center gap-2">
		<a class="hover:underline" href={resolve('/')}>Home</a>
		{#if path.length > 0}
			<span class="opacity-60">/</span>
		{/if}
		{#each path as crumb, i (i)}
			{#if i < path.length - 1}
				<a
					class="hover:underline"
					href={resolve(...crumb.href)}
					>{crumb.label}</a
				>
				<span class="opacity-60">/</span>
			{:else}
				<span>{crumb.label}</span>
			{/if}
		{/each}
	</div>
</nav>
