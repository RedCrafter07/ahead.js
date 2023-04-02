import build from '../../build';

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
		await build('development');
	},
} as Command;
