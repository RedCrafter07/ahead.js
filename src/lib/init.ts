import { existsSync } from 'fs';
import { copyFile, readdir, symlink } from 'fs/promises';
import path from 'path';
import { initDir } from './util/initDirs';
import chalk from 'chalk';

const neededDirs = [
	['.ahead', 'build', 'dist'],
	['.ahead', 'config'],
	['.ahead', 'build', 'pre', 'client'],
	['.ahead', 'build', 'pre', 'server'],
	['src', 'pages'],
	['src', 'server'],
	['src', 'preload'],
];

export default async function init(cwd: string) {
	await Promise.all(
		neededDirs
			.map((p) => path.join(path.join(cwd, ...p)))
			.map(async (d) => {
				await initDir(d);
			}),
	);

	await createSafeSymlink(
		path.join(cwd, 'src', 'pages'),
		path.join(cwd, '.ahead', 'build', 'pre', 'client', 'routes'),
	);

	await createSafeSymlink(
		path.join(cwd, 'src', 'server'),
		path.join(cwd, '.ahead', 'build', 'pre', 'server', 'routes'),
	);

	await createSafeSymlink(
		path.join(cwd, 'src', 'preload'),
		path.join(cwd, '.ahead', 'build', 'pre', 'server', 'preload'),
	);

	if (!(await existsSync(path.join(cwd, 'tsconfig.json'))))
		await copyFile(
			path.join(__dirname, 'default', 'tsconfig.json.txt'),
			path.join(cwd, 'tsconfig.json'),
		);

	if (!(await existsSync(path.join(cwd, '.gitignore'))))
		await copyFile(
			path.join(__dirname, 'default', '.gitignore.txt'),
			path.join(cwd, '.gitignore'),
		);

	const pages = await readdir(path.join(cwd, 'src', 'pages'), {
		withFileTypes: true,
	});

	if (pages.length == 0)
		await copyFile(
			path.join(__dirname, 'default', 'index.tsx.txt'),
			path.join(cwd, 'src', 'pages', 'index.tsx'),
		);

	if (!(await existsSync(path.join(cwd, 'src', 'pages', '_index.tsx'))))
		await copyFile(
			path.join(__dirname, 'default', '_index.tsx.txt'),
			path.join(cwd, 'src', 'pages', '_index.tsx'),
		);

	const server = await readdir(path.join(cwd, 'src', 'server'), {
		withFileTypes: true,
	});

	if (server.length == 0)
		await copyFile(
			path.join(__dirname, 'default', 'api.ts.txt'),
			path.join(cwd, 'src', 'server', 'api.ts'),
		);

	const preload = await readdir(path.join(cwd, 'src', 'preload'), {
		withFileTypes: true,
	});

	if (preload.length == 0)
		await copyFile(
			path.join(__dirname, 'default', 'preload.ts.txt'),
			path.join(cwd, 'src', 'preload', 'preload.ts'),
		);
}

async function createSafeSymlink(source: string, target: string) {
	if (!(await existsSync(target))) await createSymlink(source, target);
}

async function createSymlink(source: string, target: string) {
	await symlink(source, target, 'junction');
}

export async function checkDirs(cwd: string) {
	const dirsExist = await Promise.all(
		neededDirs.map(async (p) => ({
			exists: await existsSync(path.join(path.join(cwd, ...p))),
			path: path.join(path.join(cwd, ...p)),
		})),
	);

	// check if a directory doesn't exist
	if (dirsExist.filter((p) => p.exists == false).length > 0)
		throw new Error(
			chalk.red(
				"The needed directories for Ahead.js don't seem to exist. Please run 'ahead init' to create them or check if you're in the correct directory.",
			),
		);
}
