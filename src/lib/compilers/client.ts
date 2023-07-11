import path from 'path';
import { webpack, Configuration } from 'webpack';
import HTMLPlugin from 'html-webpack-plugin';
import AheadLoggingPlugin from './plugins/logging';
import PreClientPlugin from './plugins/pre/client';
import { sharedRules } from './sharedRules';
import ClientAssetsPlugin from './plugins/pre/clientAssets';

export default async function compileClient(
	dir: string,
	htmlTemplate: string,
	mode: Configuration['mode'] = 'production',
) {
	const compiler = webpack({
		mode,
		entry: [path.join(dir, 'pre', 'client', 'index.tsx')],
		output: {
			path: `${dir}/dist/client`,
			filename: '[name].js',
			chunkFilename: '[name].bundle.js',
			publicPath: '/.ahead/',
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
			},
			/* minimizer: [
				new EsbuildPlugin({
					minify: true,
				}),
			], */
		},
		resolve: {
			extensions: [
				'.js',
				'.jsx',
				'.ts',
				'.tsx',
				'.css',
				'.scss',
				'.sass',
				'.png',
				'.svg',
				'.ttf',
				'.gif',
				'.webp',
				'.jpg',
				'.jpeg',
			],
		},
		plugins: [
			new PreClientPlugin(),
			new AheadLoggingPlugin('client'),
			new ClientAssetsPlugin(),
		],
		module: {
			rules: [
				{
					test: /\.(png|ttf|svg|gif|webp|jpg|jpeg)$/, // to import images and fonts
					loader: 'url-loader',
					options: { limit: false },
				},
				...sharedRules(mode),
			],
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
