import { writeFile } from 'fs/promises';
import path from 'path';
import genRoutes from './lib/genRoutes';
import init from './lib/init';

const cwd = process.cwd();
const aheadDir = path.join(cwd, '.ahead');

(async () => {
	await init(cwd);

	console.log('Initialized!');

	const routes = await genRoutes(cwd);

	await writeFile(
		path.join(path.join(aheadDir, 'build', 'pre'), 'routes.json'),
		JSON.stringify(routes, null, 2),
	);
})();
