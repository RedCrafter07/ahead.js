import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

export default async function initDirs(paths: string[]) {
	for (const path of paths) await initDir(path);
}

export async function initDir(path: string) {
	if (!(await existsSync(path))) await mkdir(path, { recursive: true });
}
