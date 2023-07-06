import chalk from 'chalk';
import path from 'path';
import { buildAll, buildClient, buildServer } from './build';
import { ChildProcess, spawn } from 'child_process';
import chokidar from 'chokidar';

class DevServer {
	// the directory to watch
	dir: string;
	port: string;

	// watchers
	clientWatcher?: chokidar.FSWatcher;
	serverWatcher?: chokidar.FSWatcher;

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

		await buildAll('development');

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			'Watching for changes...',
		);

		this.clientWatcher = chokidar.watch(
			path.join(this.dir, 'pages').replace(path.sep, '/'),
			{
				persistent: true,
			},
		);

		this.serverWatcher = chokidar.watch(
			['preload', 'server'].map((p) =>
				path.join(this.dir, p).replace(path.sep, '/'),
			),
			{
				persistent: true,
			},
		);

		this.startProcess();

		this.registerEvents();
	}

	registerEvents() {
		this.registerClient();
		this.registerServer();
	}

	registerServer() {
		this.serverWatcher?.once('change', async () => {
			await this.handleServer();
		});
	}

	registerClient() {
		this.clientWatcher?.on('change', async () => {
			await this.handleClient();
		});
	}

	async handleClient() {
		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			'Client changed! Rebuilding...',
		);
		const buildTime = await buildClient('development');

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			`Rebuilt in ${buildTime}ms`,
		);
	}

	async handleServer() {
		console.log(chalk.hex('#0099ff').bold('[ahead]'), 'Server changed!');
		console.log(chalk.hex('#0099ff').bold('[ahead]'), 'Stopping server...');
		this.serverProcess?.kill();

		console.log(chalk.hex('#0099ff').bold('[ahead]'), 'Rebuilding...');
		const buildTime = await buildServer('development');

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			`Rebuilt in ${buildTime}ms`,
		);

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
		this.clientWatcher?.close();
		this.serverWatcher?.close();
	}
}

export default DevServer;
