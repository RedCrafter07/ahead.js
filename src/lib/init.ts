import { existsSync } from 'fs';
import { symlink } from 'fs/promises';
import path from 'path';
import initDirs from './modules/initDirs';

export default async function init(cwd: string) {
	if (await existsSync(path.join(cwd, '.ahead'))) return;

	await initDirs(
		[
			['.ahead', 'dist'],
			['.ahead', 'config'],
			['.ahead', 'routes'],
			['.ahead', 'preBuild', 'client'],
		].map((p) => path.join(cwd, ...p)),
	);

	await createSymlink(
		path.join(cwd, 'pages'),
		path.join(cwd, '.ahead', 'preBuild', 'client', 'routes'),
	);
}

async function createSymlink(source: string, target: string) {
	await symlink(source, target, 'junction');
}
