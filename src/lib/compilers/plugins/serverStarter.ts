import { spawn } from 'child_process';
import * as webpack from 'webpack';

class ServerStarterPlugin {
	dir = '.ahead/build/dist/server/server.js';
	apply(compiler: webpack.Compiler) {
		// if the compiler is not in watch mode or not in dev, return
		if (!compiler.options.watch || compiler.options.mode != 'development')
			return;

		// check if compiler has finished compiling
		let isCompiled = false;
		compiler.hooks.done.tap('done', () => {
			isCompiled = true;
		});

		// create a new child process
		let childProcess = spawn('node', [this.dir], {
			stdio: 'inherit',
		});

		// log out the child process's stdout
		childProcess.stdout?.on('data', (data) => {
			console.log(data.toString());
		});

		// watch for changes in the compiler
		compiler.hooks.watchRun.tap('watchRun', () => {
			// if the compiler has finished compiling, restart the child process
			if (isCompiled) {
				// kill the child process
				childProcess.kill();

				// create a new child process
				childProcess = spawn('node', [this.dir], {
					stdio: 'inherit',
				});

				childProcess.stdout?.on('data', (data) => {
					console.log(data.toString());
				});

				// set isCompiled to false
				isCompiled = false;
			}
		});

		// watch for the compiler to close
		compiler.hooks.watchClose.tap('watchClose', () => {
			// kill the child process
			childProcess.kill();
		});
	}
}

export default ServerStarterPlugin;
