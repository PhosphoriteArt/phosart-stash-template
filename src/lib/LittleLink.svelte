<script lang="ts" generics="T extends RouteId | Pathname">
	import { resolve } from '$app/paths';
	import type { Pathname, RouteId } from '$app/types';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		href: Parameters<typeof resolve<T>>;
		class?: string;
	}

	const { children, href, class: cls }: Props = $props();
</script>

<div class="mb-2 flex w-full justify-center text-center text-xl">
	<a
		class="text-gray-500 underline decoration-dashed hover:text-gray-400 hover:decoration-solid active:text-gray-300 {cls}"
		href={resolve<T>(...href)}
	>
		{@render children?.()}
	</a>
</div>
