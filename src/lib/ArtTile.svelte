<script lang="ts">
	import { nsfwRedact, type ArtPiece } from '@phosart/common/util';
	import Tile from './Tile.svelte';
	import { Image } from '@phosart/common';

	interface Props {
		piece: ArtPiece;
		onselect: () => void;
	}

	const { piece, onselect }: Props = $props();
</script>

<Tile title={nsfwRedact(piece.name, piece.nsfw)} onclick={onselect}>
	<Image
		alt={piece.alt}
		picture={piece.image.thumbnail}
		video={piece.video?.full}
		nsfw={piece.nsfw}
	/>
</Tile>
