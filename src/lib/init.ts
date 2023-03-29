import { existsSync } from 'fs';
import { symlink } from 'fs/promises';
import path from 'path';
import initDirs from './util/initDirs';

export default async function init(cwd: string) {
	if (await existsSync(path.join(cwd, '.ahead'))) return;

	await initDirs(
		[
			['.ahead', 'build', 'dist'],
			['.ahead', 'config'],
			['.ahead', 'build', 'pre', 'client'],
			['.ahead', 'build', 'pre', 'server'],
		].map((p) => path.join(cwd, ...p)),
	);

	await createSymlink(
		path.join(cwd, 'pages'),
		path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes'),
	);
}

async function createSymlink(source: string, target: string) {
	await symlink(source, target, 'junction');
}
