import { copyFile, writeFile } from 'fs/promises';
import path from 'path';
import compileClient from './lib/compilers/client';
import getRoutes, { genRouterData } from './lib/genRoutes';
import init from './lib/init';
import express from 'express';

const cwd = process.cwd();
const aheadDir = path.join(cwd, '.ahead');

(async () => {
	await init(cwd);

	console.log('Initialized!');

	const routes = await getRoutes(cwd);

	const data = await genRouterData(routes);

	await writeFile(
		path.join(path.join(aheadDir, 'build', 'pre'), 'routes.json'),
		JSON.stringify(data, null, 2),
	);

	await copyFile(
		path.join(__dirname, 'lib', 'client', 'router.tsx'),
		path.join(aheadDir, 'build', 'pre', 'client', 'router.tsx'),
	);
	await copyFile(
		path.join(__dirname, 'lib', 'client', 'index.tsx'),
		path.join(aheadDir, 'build', 'pre', 'client', 'index.tsx'),
	);

	await compileClient(
		path.join(aheadDir, 'build'),
		path.join(__dirname, 'lib', 'client', 'template.html'),
	);

	const app = express();

	app.use(
		'/.ahead',
		express.static(path.join(aheadDir, 'build', 'dist', 'client')),
	);

	app.get('*', (req, res) => {
		res.sendFile(path.join(aheadDir, 'build', 'dist', 'client', 'index.html'));
	});

	app.listen(3000);
})();
