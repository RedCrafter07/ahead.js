import { Config as SwcConfig } from '@swc/core';
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
				{ loader: 'postcss-loader' },
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
					minify: {
						compress: {
							unused: mode === 'production',
						},
						mangle: mode === 'production',
					},
					transform: {
						react: {
							runtime: 'automatic',
							development: mode === 'development',
						},
					},
					preserveAllComments: mode === 'production',
				},
				module: {
					type: 'commonjs',
					lazy: true,
				},
				sourceMaps: mode === 'development',
				minify: mode === 'production',
			} as SwcConfig,
		},
	] as RuleSetRule[];
};
