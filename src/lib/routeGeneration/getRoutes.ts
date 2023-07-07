import path from 'path';
import readContents from '../util/readContents';
import { readFile } from 'fs/promises';

export default async function getRoutes(cwd: string) {
	const routeDir = path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes');
	const contents = (
		await Promise.all(
			(
				await readContents(routeDir)
			)
				.map((p) => ({
					fileLocation: p,
					path: p,
				}))
				.map(async (p) => {
					const fileContent = await readFile(p.fileLocation, 'utf-8');

					let title: string | undefined;

					const titleRegex = /(\/\/ ?@ahead\/title ).+/g;

					const lines = fileContent
						.split('\n')
						.filter((l) => l.match(titleRegex));

					if (lines.length > 0)
						title = lines[0].replace(/\/\/ ?@ahead\/title /g, '').trim();

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

	return contents;
}
