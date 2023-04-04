import { spawn } from 'child_process';
import path from 'path';

export default {
	name: 'start',
	description: 'Start the compiled ahead.js app',
	aliases: ['run'],
	exec() {
		const cwd = process.cwd();

		const server = spawn('node', [
			path.join(cwd, '.ahead', 'build', 'dist', 'server', 'server.js'),
		]);

		server.stdout.on('data', (data) => {
			console.log(data.toString());
		});

		server.stderr.on('data', (data) => {
			console.error(data.toString());
		});

		process.on('SIGINT', () => {
			server.kill('SIGINT');
		});
	},
} as Command;
