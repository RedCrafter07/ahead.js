interface Command {
	name: string;
	description: string;
	aliases: string[];
	options: CommandOption[];
	exec: () => Promise<void>;
}

interface CommandOption {
	name: string;
	description: string;
	aliases: string[];
}
