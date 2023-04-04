#!/usr/bin/env node

import { readdir } from 'fs/promises';
import path from 'path';

export const commands: { [key: string]: Command } = {};

(async () => {
	const commandDirFiles = await readdir(path.join(__dirname, 'commands'), {
		withFileTypes: true,
	});
	const commandFiles = commandDirFiles.filter(
		(f) =>
			f.isFile() &&
			(f.name.endsWith('.js') ||
				(f.name.endsWith('.ts') && !f.name.endsWith('.d.ts'))),
	);

	for (const file of commandFiles) {
		const { default: command } = await import(`./commands/${file.name}`);
		commands[command.name] = command;
	}

	const cmd = process.argv.slice(2)[0];

	if (!cmd) return await commands.help.exec();

	const run = Object.values(commands).find(
		(c) => c.name === cmd || c.aliases.includes(cmd),
	);

	if (!run) {
		console.log(
			'Invalid command! Please use "ahead help" to see a list of commands.',
		);
		return;
	}

	await run.exec();
})();
