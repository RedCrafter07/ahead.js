import chalk from 'chalk';
import { Compiler } from 'webpack';

// webpack plugin for logging important events
class AheadLoggingPlugin {
	type: 'client' | 'server';
	constructor(type: 'client' | 'server') {
		this.type = type;
	}
	logEvent(event: string) {
		console.log(
			this.type == 'client'
				? chalk.blue(`[${this.type}]`)
				: chalk.green(`[${this.type}]`),
			event,
		);
	}
	async apply(compiler: Compiler) {
		compiler.hooks.done.tap('AheadLoggingPlugin', (stats) => {
			this.logEvent('Done!');
		});

		compiler.hooks.beforeCompile.tap('AheadLoggingPlugin', () => {
			this.logEvent('Compilation starts...');
		});
	}
}

export default AheadLoggingPlugin;