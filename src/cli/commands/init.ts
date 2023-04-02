import chalk from 'chalk';
import init from '../../lib/init';

export default {
	name: 'init',
	aliases: ['i'],
	description: 'Initialize a new Ahead.js project',
	async exec() {
		console.log(
			chalk.hex('#009BFF')('[Ahead.js]'),
			chalk.yellow('Initializing folders...'),
		);

		await init(process.cwd());

		console.log(
			chalk.hex('#009BFF')('[Ahead.js]'),
			chalk.green('Done! Have fun! 🚀'),
		);
	},
} as Command;
