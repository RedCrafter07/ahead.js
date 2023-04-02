import path from 'path';
import { webpack } from 'webpack';
import AheadLoggingPlugin from './plugins/logging';

export default async function compileServer(dir: string) {
	dir = path.resolve(dir);

	const compiler = webpack({
		mode: 'development',
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
		plugins: [new AheadLoggingPlugin('server')],
	});

	await new Promise((resolve, reject) => {
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
