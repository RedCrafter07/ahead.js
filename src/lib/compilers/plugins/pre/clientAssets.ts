import { Compiler } from 'webpack';
import { aheadDir } from '../../../../paths';
import path from 'path';
import { writeFile } from 'fs/promises';

class ClientAssetsPlugin {
	constructor() {}

	apply(compiler: Compiler) {
		compiler.hooks.afterCompile.tapAsync(
			'ClientAssetsPlugin',
			async (compilation, callback) => {
				// filter out assets from code splitting
				const assets = Object.keys(compilation.assets)
					.filter((f) => f.endsWith('.js'))
					.filter(
						// filter out assets from code splitting
						(f) => !f.endsWith('.bundle.js'),
					);

				await writeFile(
					path.join(aheadDir, 'build', 'pre', 'server', 'assets.json'),
					JSON.stringify(assets),
				);

				callback();
			},
		);
	}
}

export default ClientAssetsPlugin;
