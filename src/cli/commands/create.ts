import chalk from 'chalk';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import init from '../../lib/init';

export default {
	name: 'create',
	aliases: ['c'],
	description: 'Create a new Ahead.js app',
	syntax: '[directory]',
	async exec(directory: string) {
		let dir: string;
		if (directory) dir = path.resolve(directory);
		else
			dir = path.resolve(
				(
					await prompts(
						{
							name: 'directory',
							type: 'text',
							message: 'Which directory would you like to create the app in?',
							initial: process.cwd(),
						},
						{
							onCancel: () => process.exit(0),
						},
					)
				).directory,
			);

		const { gitInit, packageManager } = await prompts(
			[
				{
					name: 'gitInit',
					type: 'confirm',
					message: 'Do you want to initialize a git repository?',
				},
				{
					name: 'packageManager',
					type: 'select',
					message: 'Which package manager do you want to use?',
					choices: [
						{ title: 'pnpm', value: 'pnpm' },
						{ title: 'yarn', value: 'yarn' },
						{ title: 'npm', value: 'npm' },
					],
				},
			],
			{
				onCancel: () => process.exit(0),
			},
		);

		if (await existsSync(dir)) {
			console.log(
				chalk.yellow(
					'The directory you provided already exists.\nWould you like to overwrite it? The content will be deleted.',
				),
			);
			const { overwrite } = await prompts(
				{
					name: 'overwrite',
					type: 'confirm',
					message: 'Do you want to continue?',
				},
				{
					onCancel: () => process.exit(0),
				},
			);

			if (!overwrite) return;

			console.log(chalk.hex('#ff9900')('Deleting directory...'));

			await rm(dir, { recursive: true, force: true });
		}

		console.log(chalk.blue('Creating Ahead.js app...'));

		await mkdir(dir, { recursive: true });

		console.log(chalk.blue('Installing dependencies...'));

		await execSync(
			`${packageManager} init ${packageManager != 'pnpm' ? '-y' : ''}`,
			{ cwd: dir },
		);
		await execSync(
			`${packageManager} add typescript @types/react @types/react-dom react react-dom ahead.js`,
			{
				cwd: dir,
			},
		);

		console.log(chalk.blue('Creating files...'));
		await init(dir);

		if (gitInit) {
			console.log(chalk.blue('Initializing git repository...'));
			await execSync('git init', { cwd: dir });
		}

		console.log(chalk.blue('Adding scripts to package.json...'));
		const packageJson = JSON.parse(
			await readFile(path.join(dir, 'package.json'), 'utf-8'),
		);
		packageJson.scripts = {
			dev: 'ahead dev',
			build: 'ahead build',
			start: 'ahead start',
			clean: 'ahead clean',
		};

		await writeFile(
			path.join(dir, 'package.json'),
			JSON.stringify(packageJson, null, 2),
		);

		console.log(chalk.green('Done!'));

		console.log(`\n${chalk.strikethrough('               ')}\n`);
		console.log('Ahead.js app created successfully!');
		console.log('To start the app, run the following commands:');
		console.log(chalk.blue(`cd ${dir}`));
		console.log(chalk.blue(`${packageManager} dev`));
		console.log('');
		console.log(
			"If you're using VS Code, you can also run the following command to open the project in VS Code:",
		);
		console.log(chalk.blue(`code ${dir}`));
		console.log('');
		console.log(chalk.bold('Have fun with Ahead.js! 🎉'));
	},
} as Command;
