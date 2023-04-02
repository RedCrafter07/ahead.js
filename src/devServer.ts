import chalk from 'chalk';
import { FSWatcher, watch } from 'fs';
import path from 'path';
import { buildServer } from './build';
import { ChildProcess, spawn } from 'child_process';

class DevServer {
	dir: string;
	watcher?: FSWatcher;
	port: string;

	serverProcess?: ChildProcess;

	constructor(dir: string, port: string) {
		this.dir = path.resolve(dir);
		this.port = port;
	}

	async start() {
		// watch /pages for changes

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			'Running initial build...',
		);

		await buildServer('development');

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			'Watching for changes...',
		);

		this.watcher = watch(this.dir, { recursive: true });

		this.startProcess();

		this.registerEvents();
	}

	registerEvents() {
		this.watcher?.once('change', async (eventType, fileName) => {
			console.log(
				chalk.hex('#0099ff').bold('[ahead]'),
				chalk.hex('#0E7AF3')('File changed! Rebuilding...'),
			);

			await this.handleChange();
		});
	}

	async handleChange() {
		console.log(chalk.hex('#0099ff').bold('[ahead]'), 'Stopping server...');
		this.serverProcess?.kill();

		console.log(chalk.hex('#0099ff').bold('[ahead]'), 'Rebuilding...');
		await buildServer('development');

		console.log(chalk.hex('#0099ff').bold('[ahead]'), 'Starting server...');

		this.startProcess();

		this.registerEvents();
	}

	startProcess() {
		this.serverProcess = spawn(
			'node',
			[
				path.join(
					process.cwd(),
					'.ahead',
					'build',
					'dist',
					'server',
					'server.js',
				),
			],
			{
				env: {
					AHEAD_PORT: this.port,
				},
			},
		);

		this.serverProcess.stdout?.on('data', (data) => {
			console.log(chalk.hex('#009BFF').bold(`[server]`), data.toString());
		});
	}

	async stop() {
		console.log('Closing dev server...');
		this.serverProcess?.kill();
		this.watcher?.close();
	}
}

export default DevServer;
