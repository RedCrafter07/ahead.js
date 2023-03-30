import chalk from 'chalk';
import { commands } from '../index';

export default {
	name: 'help',
	aliases: ['h'],
	description: 'Shows this help message',
	options: [],
	async exec() {
		console.log(chalk.hex('#009BFF').underline('Ahead.js Commands'));

		Object.values(commands).forEach((command) => {
			console.log(chalk.underline(command.name));
			console.log(
				`	Alias${command.aliases.length != 1 ? 'es' : ''}:`,
				command.aliases.length > 0
					? command.aliases.join(', ')
					: chalk.italic('None'),
			);
			console.log('	Description:', command.description);
		});

		console.log('Have fun building your Ahead.js project! 🚀');
	},
} as Command;
