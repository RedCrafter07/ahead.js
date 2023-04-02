import path from 'path';
import { webpack, Configuration } from 'webpack';
import HTMLPlugin from 'html-webpack-plugin';
import AheadLoggingPlugin from './plugins/logging';
import PreClientPlugin from './plugins/pre/client';

export default async function compileClient(
	dir: string,
	htmlTemplate: string,
	mode: Configuration['mode'] = 'production',
) {
	const compiler = webpack(
		{
			mode,
			entry: {
				client: path.join(dir, 'pre', 'client', 'index.tsx'),
			},
			output: {
				path: `${dir}/dist/client`,
				filename: '[name].js',
				publicPath: '/.ahead/',
			},
			optimization: {
				splitChunks: {
					chunks: 'all',
				},
				minimize: false,
			},
			resolve: {
				extensions: [
					'.js',
					'.ts',
					'.jsx',
					'.tsx',
					'.css',
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
				new HTMLPlugin({
					template: htmlTemplate,
				}),
				new AheadLoggingPlugin('client'),
			],
			module: {
				rules: [
					{
						test: /\.css$/,
						use: [
							{ loader: 'style-loader' },
							{ loader: 'css-loader' },
							{ loader: 'postcss-loader' },
						],
					},
					{
						test: /\.s[ca]ss$/,
						use: [
							{ loader: 'style-loader' },
							{ loader: 'css-loader' },
							{ loader: 'sass-loader' },
						],
					},
					{
						test: /\.tsx?$/,
						loader: 'esbuild-loader',
						options: {
							loader: 'tsx',
							target: 'esnext',
						},
					},
					{
						test: /\.(png|ttf|svg|gif|webp|jpg|jpeg)$/, // to import images and fonts
						loader: 'url-loader',
						options: { limit: false },
					},
				],
			},
			watch: mode === 'development',
		},
		(err, stats) => {},
	);
}
