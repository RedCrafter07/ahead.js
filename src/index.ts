import { copyFile, writeFile } from 'fs/promises';
import path from 'path';
import compileClient from './lib/compilers/client';
import { transform } from './lib/routeGeneration/client';
import init from './lib/init';
import express from 'express';
import getRoutes from './lib/routeGeneration/getRoutes';
import generateServerRoutes from './lib/routeGeneration/server';

const cwd = process.cwd();
export const aheadDir = path.join(cwd, '.ahead');

(async () => {
	await init(cwd);

	console.log('Initialized!');

	const routes = await getRoutes(cwd);

	await writeFile(
		path.join(path.join(aheadDir, 'build', 'pre', 'client'), 'routes.tsx'),
		`import React from "react";\n${transform(routes)}`,
	);
	await copyFile(
		path.join(__dirname, 'lib', 'client', 'router.tsx'),
		path.join(aheadDir, 'build', 'pre', 'client', 'router.tsx'),
	);
	await copyFile(
		path.join(__dirname, 'lib', 'client', 'index.tsx'),
		path.join(aheadDir, 'build', 'pre', 'client', 'index.tsx'),
	);

	await writeFile(
		path.join(aheadDir, 'build', 'pre', 'server', 'index.ts'),
		generateServerRoutes(routes),
	);

	await compileClient(
		path.join(aheadDir, 'build'),
		path.join(__dirname, 'lib', 'client', 'template.html'),
	);
})();
