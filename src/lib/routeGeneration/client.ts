import path from 'path';
import { aheadDir } from '../../build';

interface Route {
	index?: boolean;
	path?: string;
	children?: Route[];
	element?: string;
}

export interface IndexedRoute {
	path: string;
	fileLocation: string;
	title?: string;
}

function transformImports(data: IndexedRoute[]): {
	data: IndexedRoute[];
	imports: string[];
} {
	const imports = [];
	for (const d of data) {
		const i = imports.indexOf(d.fileLocation);
		if (i > -1) d.fileLocation = '<Import_' + i + ' />';
		else {
			imports.push(d.fileLocation);
			d.fileLocation = `<Import_${imports.length - 1} />`;
		}
	}

	return { data, imports };
}

// Credit: FishingHacks
// Modified by RedCrafter07
function transformToRoutes(indexed: IndexedRoute[]): Route[] {
	const router: Route[] = [];

	for (const i of indexed) {
		const path = i.path.split('/');
		let current: Route = { path: '', children: router };

		if (!current.children) current.children = [];

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

			if (!current.children) current.children = [];

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

		if (!current.children) current.children = [];

		current.children.push({
			index: true,
			element: i.fileLocation,
		});
	}

	return router;
}

function transformToComponents(routes: Route[]) {
	function generateComponents(routes: Route[]) {
		let routeString = '';

		for (const route of routes) {
			if (
				(route.path == '/' || route.path == '') &&
				route.children &&
				route.children.length > 0
			) {
				routeString += generateComponents(route.children);
			} else if (route.children && route.children.length > 0) {
				routeString += `<Route path="${route.path}">\n`;
				routeString += generateComponents(route.children);
				routeString += `\n</Route>\n`;
			} else {
				routeString += `<Route ${
					route.path ? `path="${route.path}"` : 'index'
				} element={${route.element}}/>`;
			}
		}

		return routeString;
	}

	return `<>
${generateComponents(routes)}
</>`;
}

export function transform(routes: IndexedRoute[], client: boolean = true) {
	let file = '';

	const { data, imports } = transformImports(routes);
	const router = transformToRoutes(data);

	for (let i = 0; i < imports.length; ++i) {
		const importData = imports[i]
			.split('.')
			.slice(0, -1)
			.join('.')
			.replaceAll(path.sep, '/')
			.slice(path.join(aheadDir, 'build', 'pre', 'client').length);

		const jsonImport = JSON.stringify(
			`.${!client ? './client' : ''}${importData}`,
		);
		if (client)
			file += `const Import_${i} = React.lazy(() => import(${jsonImport}));\n`;
		else file += `import Import_${i} from ${jsonImport};\n`;
	}
	file += '\n\nexport default ';
	file += JSON.stringify(router, null, 2);
	// file += transformToComponents(router);

	return file.replaceAll(
		/"element":\s*"(<Import_[0-9]+ \/>)"/g,
		'"element": $1',
	); // turn "<Element_1 />" to <Element_1>
}

export function transformClient(
	routes: IndexedRoute[],
	client: boolean = true,
) {
	let file = '';

	const { data, imports } = transformImports(routes);
	const router = transformToRoutes(data);

	for (let i = 0; i < imports.length; ++i) {
		const importData = imports[i]
			.split('.')
			.slice(0, -1)
			.join('.')
			.replaceAll(path.sep, '/')
			.slice(path.join(aheadDir, 'build', 'pre', 'client').length);

		const jsonImport = JSON.stringify(
			`.${!client ? './client' : ''}${importData}`,
		);
		if (client)
			file += `const Import_${i} = React.lazy(() => import(${jsonImport}));\n`;
		else file += `import Import_${i} from ${jsonImport};\n`;
	}
	file += '\n\nexport default ';
	// file += JSON.stringify(router, null, 2);
	file += transformToComponents(router);

	return file.replaceAll(
		/"element":\s*"(<Import_[0-9]+ \/>)"/g,
		'"element": $1',
	); // turn "<Element_1 />" to <Element_1>
}
