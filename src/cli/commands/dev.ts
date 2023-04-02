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
		const port = process.argv.slice(2)[1];

		const devServer = new DevServer(
			path.join(cwd, 'pages'),
			port && port.length > 0 ? port : '3000',
		);
		await devServer.start();

		process.on('exit', () => {
			devServer.stop();
		});
	},
} as Command;
