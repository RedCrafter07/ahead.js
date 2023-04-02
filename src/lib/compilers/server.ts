import path from 'path';
import { Configuration, webpack } from 'webpack';
import AheadLoggingPlugin from './plugins/logging';
import PreServerPlugin from './plugins/pre/server';

export default async function compileServer(
	dir: string,
	mode: Configuration['mode'] = 'production',
) {
	dir = path.resolve(dir);

	const compiler = webpack({
		mode,
		entry: {
			server: path.join(dir, 'pre', 'server', 'index.tsx'),
		},
		output: {
			path: `${dir}/dist/server`,
			filename: '[name].js',
		},
		target: 'node',
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'esbuild-loader',
					options: {
						loader: 'tsx',
						target: 'esnext',
					},
					exclude: /node_modules/,
				},
			],
		},
		plugins: [new PreServerPlugin(), new AheadLoggingPlugin('server')],
		optimization: {
			minimize: false,
		},
	});

	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err) {
				reject(err);
			} else if (stats?.hasErrors()) {
				reject(stats.toString());
			} else {
				resolve(stats);
			}
		});
	});
}
