import type { RequestHandler } from '@sveltejs/kit';
import { text } from '@sveltejs/kit';

export const prerender = false;

const FALLBACK_ROBOTS = `
User-agent: AI2Bot
User-agent: Ai2Bot-Dolma
User-agent: Amazonbot
User-agent: anthropic-ai
User-agent: Applebot
User-agent: Applebot-Extended
User-agent: Bytespider
User-agent: CCBot
User-agent: ChatGPT-User
User-agent: Claude-Web
User-agent: ClaudeBot
User-agent: cohere-ai
User-agent: cohere-training-data-crawler
User-agent: Crawlspace
User-agent: Diffbot
User-agent: DuckAssistBot
User-agent: FacebookBot
User-agent: FriendlyCrawler
User-agent: Google-Extended
User-agent: GoogleOther
User-agent: GoogleOther-Image
User-agent: GoogleOther-Video
User-agent: GPTBot
User-agent: iaskspider/2.0
User-agent: ICC-Crawler
User-agent: ImagesiftBot
User-agent: img2dataset
User-agent: ISSCyberRiskCrawler
User-agent: Kangaroo Bot
User-agent: Meta-ExternalAgent
User-agent: Meta-ExternalFetcher
User-agent: OAI-SearchBot
User-agent: omgili
User-agent: omgilibot
User-agent: PanguBot
User-agent: PerplexityBot
User-agent: PetalBot
User-agent: Scrapy
User-agent: SemrushBot-OCOB
User-agent: SemrushBot-SWA
User-agent: Sidetrade indexer bot
User-agent: Timpibot
User-agent: VelenPublicWebCrawler
User-agent: Webzio-Extended
User-agent: YouBot
Disallow: /
`.trim();

export const GET: RequestHandler = async () => {
	if (!process.env.DARK_VISITORS_KEY) {
		return text(FALLBACK_ROBOTS, {
			headers: { 'Cache-Control': 'max-age=86400', 'Content-Type': 'text/plain' }
		});
	}
	try {
		const response = await fetch('https://api.darkvisitors.com/robots-txts', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + process.env.DARK_VISITORS_KEY,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				agent_types: [
					'AI Data Scraper',
					'Undocumented AI Agent',
					'AI Assistant',
					'AI Search Crawler'
				],
				disallow: '/'
			})
		});

		return text(await response.text(), {
			headers: { 'Cache-Control': 'max-age=86400', 'Content-Type': 'text/plain' }
		});
	} catch {
		return text(FALLBACK_ROBOTS, {
			headers: { 'Cache-Control': 'max-age=86400', 'Content-Type': 'text/plain' }
		});
	}
};
