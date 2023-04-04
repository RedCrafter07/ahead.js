import chalk from 'chalk';
import { mkdir, readdir, rm } from 'fs/promises';
import path from 'path';

export default {
	name: 'cleanup',
	aliases: ['clean'],
	description: 'Cleans up the Ahead build directory.',
	async exec() {
		const cwd = process.cwd();
		const buildDir = path.join(cwd, '.ahead', 'build');

		const startTime = Date.now();

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			'Cleaning up build directory...',
		);

		await rm(path.join(buildDir, 'dist'), { recursive: true, force: true });
		await mkdir(path.join(buildDir, 'dist'), { recursive: true });

		async function scanDir(dir: string) {
			const content = await readdir(dir, { withFileTypes: true });

			const files = content.filter((f) => f.isFile()).map((f) => f.name);
			const dirs = content
				.filter((f) => f.isDirectory() && !f.isSymbolicLink())
				.map((f) => f.name);

			await Promise.all(files.map(async (f) => rm(path.join(dir, f))));

			await Promise.all(
				dirs.map(async (d) => await scanDir(path.join(dir, d))),
			);
		}

		await scanDir(buildDir);

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			chalk.green(`Operation completed in ${Date.now() - startTime}ms.`),
		);
	},
} as Command;
