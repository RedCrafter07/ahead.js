import path from 'path';
import readContents from './util/readContents';
import { RouteObject } from 'react-router-dom';

export default async function getRoutes(cwd: string) {
	const routeDir = path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes');
	const contents = (await readContents(routeDir))
		.map((p) => ({
			fileLocation: p,
			path: p,
		}))
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
			path: p.path.replace(path.sep, '/'),
		}));

	return contents;
}

interface Route {
	path: string;
	children: (Route | { index: true; element: string })[];
}

interface IndexedRoute {
	path: string;
	fileLocation: string;
}

export async function genRouterData(indexed: IndexedRoute[]): Promise<Route[]> {
	const router: Route[] = [];

	for (const i of indexed) {
		const path = i.path.split('/');
		let current: Route = { path: '', children: router };

		let subpath = path[1];
		if (subpath.startsWith('{') && subpath.endsWith('}'))
			subpath = ':' + subpath.substring(1, subpath.length - 1);
		subpath = '/' + subpath;

		const newCurrent = current.children.find(
			(el) => !(el as any).index && (el as any).path === subpath,
		);
		if (!newCurrent) {
			const newPath: Route = {
				path: subpath,
				children: [],
			};
			current.children.push(newPath);
			current = newPath;
		} else current = newCurrent as Route;

		for (let subpath of path.slice(2)) {
			if (subpath.startsWith('{') && subpath.endsWith('}'))
				subpath = ':' + subpath.substring(1, subpath.length - 1);

			const newCurrent = current.children.find(
				(el) => !(el as any).index && (el as any).path === subpath,
			);
			if (!newCurrent) {
				const newPath: Route = {
					path: subpath,
					children: [],
				};
				current.children.push(newPath);
				current = newPath;
			} else current = newCurrent as Route;
		}
		current.children.push({
			index: true,
			element: i.fileLocation,
		});
	}

	return router;
}
