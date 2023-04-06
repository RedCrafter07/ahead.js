#!/usr/bin/env node

import { readdir } from 'fs/promises';
import path from 'path';
import commander from 'commander';

export const commands: { [key: string]: Command } = {};

const { program } = commander;
program.name('ahead');

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

		const cmd: Command = command;
		const commanderCmd = program
			.command(`${cmd.name}${cmd.syntax ? ` ${cmd.syntax}` : ''}`)
			.description(cmd.description)
			.action(cmd.exec);

		cmd.aliases.forEach((alias) => commanderCmd.alias(alias));
	}

	const cmd = program.parse(process.argv);

	/* 
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

	await run.exec(); */
})();
