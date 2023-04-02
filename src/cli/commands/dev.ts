export default {
	name: 'dev',
	aliases: [],
	description: 'Start the Ahead.js Dev Server',
	syntax: '[PORT]',
	options: [
		{
			name: 'port',
			description: 'The port to run the server on',
			default: '3000',
		},
	],
	async exec() {},
} as Command;
