import { readdir } from 'fs/promises';
import path from 'path';

export default async function readContents(dir: string) {
	const paths: string[] = [];

	async function getContents(dir: string) {
		const content = await readdir(dir, { withFileTypes: true });

		for (const item of content) {
			if (item.isDirectory()) {
				await getContents(path.join(dir, item.name));
			} else if (item.isFile()) {
				paths.push(path.join(dir, item.name));
			}
		}
	}

	await getContents(dir);

	return paths;
}
