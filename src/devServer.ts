import chalk from 'chalk';
import path from 'path';
import { buildClient, buildServer } from './build';
import { ChildProcess, spawn } from 'child_process';
import chokidar from 'chokidar';
import { readdir } from 'fs/promises';

class DevServer {
	// the directory to watch
	dir: string;
	port: string;
	mode: 'development' | 'production';

	// watchers
	clientWatcher?: chokidar.FSWatcher;
	serverWatcher?: chokidar.FSWatcher;

	serverProcess?: ChildProcess;

	constructor(
		dir: string,
		port: string,
		mode: 'development' | 'production' = 'development',
	) {
		this.dir = path.resolve(dir);
		this.port = port;
		this.mode = mode;
	}

	async start() {
		// watch /pages for changes

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			'Running initial build...',
		);

		await buildClient(this.mode);
		await buildServer(this.mode);

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			'Watching for changes...',
		);

		const serverDirectories = ['preload', 'server'];

		this.clientWatcher = chokidar.watch(
			path.join(this.dir, 'pages').replace(path.sep, '/'),
			{
				persistent: true,
			},
		);

		// scan other directories for changes
		// get all directories in dir
		const directories = (await readdir(this.dir, { withFileTypes: true }))
			.filter((f) => f.isDirectory())
			.map((d) => d.name)
			.filter((f) => serverDirectories.includes(f));

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			chalk.gray(`Watching other directories: ${directories.join(', ')}}`),
		);

		directories.forEach((d) => {
			this.clientWatcher?.add(path.join(this.dir, d).replace(path.sep, '/'));
		});

		this.serverWatcher = chokidar.watch(
			serverDirectories.map((p) =>
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

		this.clientWatcher?.on('unlink', async () => {
			await this.handleClient();
		});
	}

	async handleClient() {
		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			'Client changed! Rebuilding...',
		);
		const buildTime = await buildClient(this.mode);

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
		const buildTime = await buildServer(this.mode);

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			`Rebuilt in ${buildTime}ms`,
		);

		console.log(chalk.hex('#0099ff').bold('[ahead]'), 'Starting server...');

		this.startProcess();

		this.registerServer();
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
					ENVIRONMENT: this.mode,
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
