import chalk from 'chalk';
import { Router } from 'express';
import { existsSync } from 'fs';
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
	const routes = files.map((f) => {
		const fileName = path.basename(f, '.ts');

		return {
			path: `/${fileName.replaceAll(/[^\w\d]/g, '-')}`,
			file: fileName,
		};
	});

	return routes;
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
	const apiRouteDir = path.join(
		process.cwd(),
		'.ahead',
		'build',
		'pre',
		'server',
		'routes',
	);

	if (!(await existsSync(apiRouteDir))) return { imports: '', express: '' };

	const files = await scanDir(apiRouteDir);

	const routes = await genRoutes(files);
	const imports = await genImports(files);
	const express = await genExpress(routes);

	return {
		imports,
		express,
	};
}
