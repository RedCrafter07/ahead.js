import { copyFile, mkdir, readdir } from 'fs/promises';
import path from 'path';

(async () => {
	async function copyFiles(dir: string) {
		const files = await readdir(dir, { withFileTypes: true });
		await Promise.all(
			files.map(async (file) => {
				if (file.isDirectory()) {
					await copyFiles(path.join(dir, file.name));
				}

				if (
					file.isFile() &&
					(file.name.endsWith('.txt') || file.name.endsWith('.html'))
				) {
					console.log(`Copying ${file.name} to build folder`);

					await mkdir(
						path.join(
							path.join(__dirname, '..', 'dist'),
							dir.slice(__dirname.length),
						),
						{
							recursive: true,
						},
					);

					await copyFile(
						path.join(dir, file.name),
						path.join(
							path.join(__dirname, '..', 'dist'),
							dir.slice(__dirname.length),
							file.name,
						),
					);
				}
			}),
		);
	}

	await copyFiles(__dirname);
	await copyFile('../package.json', '../dist/package.json');
	await copyFile('../README.md', '../dist/README.md');
	await copyFile('../LICENSE', '../dist/LICENSE');
})();
