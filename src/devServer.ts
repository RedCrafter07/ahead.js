import chalk from 'chalk';
import { FSWatcher, watch } from 'fs';
import path from 'path';
import { buildServer } from './build';

class DevServer {
	dir: string;
	watcher?: FSWatcher;

	constructor(dir: string) {
		this.dir = path.resolve(dir);
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
		await buildServer('development');

		this.registerEvents();
	}

	async stop() {
		this.watcher?.close();
	}
}

export default DevServer;
