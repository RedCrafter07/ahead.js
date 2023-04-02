import chalk from 'chalk';
import { Compiler } from 'webpack';

// webpack plugin for logging important events
class AheadLoggingPlugin {
	type: 'client' | 'server';
	constructor(type: 'client' | 'server') {
		this.type = type;
	}
	logEvent(...events: string[]) {
		console.log(
			chalk
				.hex(this.type == 'client' ? '#0CCAE8' : '#009BFF')
				.bold(`[${this.type}]`),
			...events,
		);
	}
	async apply(compiler: Compiler) {
		compiler.hooks.done.tap('AheadLoggingPlugin', (stats) => {
			this.logEvent(
				chalk.green(
					`Compilation finished in ${stats.endTime - stats.startTime}ms`,
				),
			);
		});

		compiler.hooks.run.tap('AheadLoggingPlugin', () => {
			this.logEvent('Compilation starts...');
		});

		compiler.hooks.watchRun.tap('AheadLoggingPlugin', () => {
			this.logEvent('Watching for changes...');
		});

		compiler.hooks.failed.tap('AheadLoggingPlugin', (o) => {
			this.logEvent('Failed!', o.message);
		});
	}
}

export default AheadLoggingPlugin;
