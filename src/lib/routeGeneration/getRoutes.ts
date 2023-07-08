import path from 'path';
import readContents from '../util/readContents';
import { readFile } from 'fs/promises';

export default async function getRoutes(cwd: string) {
	const routeDir = path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes');

	const contents = (await readContents(routeDir)).filter(
		(p) =>
			(p.endsWith('.ts') || p.endsWith('.tsx')) && !p.endsWith('_index.tsx'),
	);

	const routes = (
		await Promise.all(
			contents
				.map((p) => ({
					fileLocation: p,
					path: p,
				}))
				.map(async (p) => {
					const fileContent = await readFile(p.fileLocation, 'utf-8');

					let title: string | undefined;

					const titleRegex = /<title>([^{}]+)<\/title>/g;

					// get the first capture group
					const titleMatch = titleRegex.exec(fileContent);

					if (titleMatch) {
						title = titleMatch[1].trim();
					}

					return {
						...p,
						title,
					};
				}),
		)
	)
		// remove the routeDir and the file extension
		.map((p) => ({
			...p,
			path: p.path.slice(
				routeDir.length + path.sep.length,
				-path.extname(p.path).length,
			),
		}))
		// replace path.sep with '/' and remove 'index', as it signalizes the root
		.map((p) => ({
			...p,
			path: `/${p.path.replace(path.sep, '/').replace('index', '')}`,
		}))
		// remove the remaining / at the end if there is one and the path is not /
		.map((p) => ({
			...p,
			path: p.path.length > 1 ? p.path.replace(/\/$/, '') : p.path,
		}))
		.map((p) => ({
			...p,
			path: p.path.replace(path.sep, '/').replace(/\{(\w+)\}/g, ':$1'),
		}));

	return routes;
}
