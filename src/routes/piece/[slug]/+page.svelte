<script lang="ts">
	import Header from '$lib/Header.svelte';
	import { OpengraphMeta, Image, HighResContext, Description } from 'phosart-common';

	const { data } = $props();

	let alt: number | null = $state(null);
</script>

<OpengraphMeta type="piece" resource={data.piece} siteName={data.config.title} setPageTitle />

<Header title={data.config.title} subtitle={data.config.subtitle} />

<div class="flex flex-col items-center">
	<div class="max-w-8/12 overflow-hidden rounded-2xl">
		<HighResContext>
			<Image alt={data.piece.alt} picture={data.piece.image.full} />
		</HighResContext>
	</div>
	<div>
		<Description
			piece={data.piece}
			visible
			showName
			selectedAlt={alt}
			onselectalt={(i) => void (alt = i)}
		/>
	</div>
</div>
