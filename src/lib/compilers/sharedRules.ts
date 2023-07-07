import { Configuration, RuleSetRule } from 'webpack';

export const sharedRules = (mode: Configuration['mode']): RuleSetRule[] => {
	return [
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
			loader: 'swc-loader',
			options: {
				jsc: {
					parser: {
						syntax: 'typescript',
						jsx: true,
						dynamicImport: true,
					},
					transform: {
						react: {
							runtime: 'automatic',
							development: mode === 'development',
						},
					},
				},
				module: {
					type: 'commonjs',
				},
				sourceMaps: mode === 'development',
				minify: mode === 'production',
			},
		},
	] as RuleSetRule[];
};
