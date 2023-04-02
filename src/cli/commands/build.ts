import path from 'path';
import build from '../../build';

const cwd = process.cwd();
export const aheadDir = path.join(cwd, '.ahead');

export default {
	name: 'build',
	aliases: [],
	description: 'Build the Ahead.js app',
	async exec() {
		await build('production');
	},
} as Command;
