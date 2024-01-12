import path from 'path';
import { aheadDir } from '../../build';
import type { IndexedRoute } from './client';
import generateApiRoutes from './apiRoutes';
import { Configuration } from 'webpack';

export default async function generateServerRoutes(
	routes: IndexedRoute[],
	mode: Configuration['mode'],
) {
	const apiRoutes = await generateApiRoutes();

	const serverRouter = routes
		.map((r) => {
			const p = r.path;
			return `app.get("${p}", async (req, res) => {				
		await sendClient(req, res);
	})`;
		})
		.join('\n\n	');

	const clientDistDir = path.join(aheadDir, 'build', 'dist', 'client');

	return `import express from 'express';
import handleSSR from './ssrHandler';
import preload from "./preload";

// Client route imports
${apiRoutes.imports}

(async () => {
	const { app, server } = await preload(express());
	const port = process.env.AHEAD_PORT ? process.env.AHEAD_PORT : 3000;
	const mode = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'production';

	${apiRoutes.express}

	app.use("/.ahead", express.static('${clientDistDir.replaceAll('\\', '\\\\')}'))

	async function sendClient(req: express.Request, res: express.Response) {
		console.log("Handling SSR:", req.url);
		await handleSSR(req, res, mode);
	}

	${serverRouter}

	${
		mode === 'development'
			? `
	app.get("*", async (req, res) => {
		await sendClient(req, res);
	})`
			: ''
	}

	server.listen(port, () => {console.log("Listening on port " + port)})
})()
`;
}
