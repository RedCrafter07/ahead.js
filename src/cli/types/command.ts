interface Command {
	name: string;
	description: string;
	aliases: string[];
	options?: CommandOption[];
	syntax?: string;
	exec: () => Promise<void>;
}

interface CommandOption {
	name: string;
	description: string;
	default: string;
}
