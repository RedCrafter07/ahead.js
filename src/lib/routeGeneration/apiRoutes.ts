import chalk from 'chalk';
import { Router } from 'express';
import { readdir } from 'fs/promises';
import path from 'path';

async function scanDir(directory: string) {
	const dir = await readdir(path.resolve(directory), { withFileTypes: true });
	const files = dir
		.filter(
			(f) => f.isFile() && (f.name.endsWith('.ts') || f.name.endsWith('.tsx')),
		)
		.map((f) => f.name);

	if (dir.filter((f) => f.isDirectory()).length > 0)
		console.log(
			chalk.yellow.bold('[ahead]'),
			'Warning: Subdirectories are not supported in the server directory. Folder contents will be ignored.',
		);

	return files;
}

async function genRoutes(files: string[]) {
	const relativePaths = files.map((f) => {
		const rel = path.relative(
			path.join(__dirname),
			path.join(process.cwd(), '.ahead', 'build', 'pre', 'server', 'routes'),
		);

		return `./${rel.replaceAll(path.sep, '/')}/${path.basename(f, '.ts')}`;
	});

	interface RouteExport {
		default: Router;
		path: string;
		filePath: string;
	}

	const imports = (
		await Promise.all(
			relativePaths.map(async (p) => {
				try {
					return {
						...(await import(p)),
						filePath: p,
					};
				} catch {
					return null;
				}
			}),
		)
	).filter((i) => i != null) as any[];

	// filter out any files that don't match the type RouteExport
	const routes = imports.filter(
		(i) => i.default && typeof i.path == 'string',
	) as RouteExport[];

	if (routes.length < imports.length || imports.length != files.length) {
		console.log(
			chalk.yellow.bold('[ahead]'),
			'Warning: Some files in the server directory are not valid route files. They will be ignored.',
		);
		console.log(
			chalk.hex('#ff9900').bold('[ahead]'),
			"You should export an express router by default as well as a variable named 'path' which provides the path to the router, e.g. /api",
		);
	}

	return routes.map((r) => ({
		path: r.path,
		file: `${path.resolve(r.filePath)}.ts`,
	}));
}

async function genImports(files: string[]) {
	const relativePaths = files.map((f) => {
		const rel = path.relative(
			path.join(process.cwd(), '.ahead', 'build', 'pre', 'server'),
			path.join(process.cwd(), '.ahead', 'build', 'pre', 'server', 'routes'),
		);

		return `./${rel.replaceAll(path.sep, '/')}/${path.basename(f, '.ts')}`;
	});

	return relativePaths.map((p, i) => `import Api${i} from '${p}';`).join('\n');
}

async function genExpress(data: { path: string; file: string }[]) {
	return data.map((d, i) => `app.use('${d.path}', Api${i});`).join('\n');
}

export default async function generateApiRoutes() {
	const files = await scanDir(
		path.join(process.cwd(), '.ahead', 'build', 'pre', 'server', 'routes'),
	);

	const routes = await genRoutes(files);
	const imports = await genImports(files);
	const express = await genExpress(routes);

	return {
		imports,
		express,
	};
}
