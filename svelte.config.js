import adapterVercel from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { readThemeConfig, readThemeSchema } from '@phosart/common/server';

async function getWebMode() {
	try {
		const tc = await readThemeConfig(await readThemeSchema());
		return tc.websiteMode;
	} catch (e) {
		console.warn(e);
		return null;
	}
}

const tc = await getWebMode();

process.env.ADAPTER = tc ?? 'static';
if (process.env.FORCE_STATIC === 'true') {
	process.env.ADAPTER = 'static';
} else if (process.env.VERCEL === '1') {
	process.env.ADAPTER = 'vercel';
}

const adapter =
	process.env.ADAPTER === 'vercel'
		? adapterVercel()
		: adapterStatic({
				fallback: '404.html'
			});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter,
		prerender: { handleUnseenRoutes: 'warn' },
		paths: {
			// @ts-ignore
			base: process.argv.includes('dev') ? '' : (process.env.BASE_PATH ?? undefined)
		}
	}
};

export default config;
