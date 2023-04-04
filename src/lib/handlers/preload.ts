import chalk from 'chalk';
import { readdir } from 'fs/promises';
import path from 'path';

async function scanDir(dir: string) {
	const content = await readdir(dir, { withFileTypes: true });

	const files = content.filter((f) => f.isFile()).map((f) => f.name);
	if (content.filter((f) => f.isDirectory()).length > 0)
		console.log(
			chalk.yellow.bold('[ahead]'),
			'Warning: Subdirectories are not supported in the preload directory. Folder contents will be ignored.',
		);

	return files;
}

async function genImports(files: string[]) {
	const relativePaths = files.map((f) => {
		const relative = path.relative(
			path.join(process.cwd(), '.ahead', 'build', 'pre', 'server'),
			path.join(process.cwd(), '.ahead', 'build', 'pre', 'server', 'preload'),
		);

		return `./${relative.replaceAll(path.sep, '/')}/${path.basename(f, '.ts')}`;
	});

	return relativePaths
		.map((p, i) => `import Preload${i} from '${p}';`)
		.join('\n');
}

async function genPreload(files: string[]) {
	const preloadStatements = files
		.map((f, i) => `	app = await Preload${i}(app);`)
		.join('\n');

	return `export default async function preload(app: Express.Application) {
		${preloadStatements}

		return app;
	}`;
}

export default async function generatePreload() {
	const files = await scanDir(
		path.join(process.cwd(), '.ahead', 'build', 'pre', 'server', 'preload'),
	);

	const imports = await genImports(files);
	const preload = await genPreload(files);

	return { imports, preload };
}