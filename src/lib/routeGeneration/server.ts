import path from 'path';
import { aheadDir } from '../..';
import type { IndexedRoute } from './client';
export default function generateServerRoutes(routes: IndexedRoute[]) {
	const serverRouter = routes
		.map((r) => r.path)
		.map((p) => {
			return `app.get("${p}", (req, res) => {				
	sendClient(req, res)
})`;
		})
		.join('\n\n');

	const clientDistDir = path.join(aheadDir, 'build', 'dist', 'client');

	return `import express from 'express';
import handleSSR from './ssrHandler';

const app = express();

app.use("/.ahead", express.static('${clientDistDir.replaceAll('\\', '\\\\')}'))

function sendClient(req: express.Request, res: express.Response) {
	res.send(handleSSR(req.originalUrl));
}

${serverRouter}

app.listen(3000, () => {console.log("Listening on port 3000")})
`;
}
