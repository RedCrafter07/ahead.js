import path from 'path';
import DevServer from '../../devServer';

export default {
	name: 'dev',
	aliases: ['d'],
	description: 'Start the Ahead.js Dev Server',
	syntax: '[PORT]',
	options: [
		{
			name: 'port',
			description: 'The port to run the server on',
			default: '3000',
		},
	],
	async exec() {
		const cwd = process.cwd();

		const devServer = new DevServer(path.join(cwd, 'pages'));
		await devServer.start();

		process.on('exit', () => {
			devServer.stop();
		});
	},
} as Command;
