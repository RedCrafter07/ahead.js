import { existsSync } from 'fs';
import { symlink } from 'fs/promises';
import path from 'path';
import initDirs, { initDir } from './util/initDirs';

const neededDirs = [
	['.ahead', 'build', 'dist'],
	['.ahead', 'config'],
	['.ahead', 'build', 'pre', 'client'],
	['.ahead', 'build', 'pre', 'server'],
];

export default async function init(cwd: string) {
	await Promise.all(
		neededDirs
			.map((p) => path.join(path.join(cwd, ...p)))
			.map(async (d) => {
				await initDir(d);
			}),
	);

	if (
		!(await existsSync(
			path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes'),
		))
	)
		await createSymlink(
			path.join(cwd, 'pages'),
			path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes'),
		);
}

async function createSymlink(source: string, target: string) {
	await symlink(source, target, 'junction');
}
