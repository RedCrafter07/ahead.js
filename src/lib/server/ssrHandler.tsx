// @ts-ignore
import routerData from './.ssr';
import React from 'react';
import { RouteObject } from 'react-router-dom';
import {
	createStaticHandler,
	createStaticRouter,
	StaticHandlerContext,
	StaticRouterProvider,
} from 'react-router-dom/server';
import { readFile } from 'fs/promises';
import { renderToString } from 'react-dom/server';

const routes: RouteObject[] = routerData;

export default async function handleSSR(route: string) {
	const htmlTemplate = await readFile('../client/index.html', 'utf-8');

	const { query, dataRoutes } = createStaticHandler(routes);
	const ctx = (await query({
		url: route,
		method: 'GET',
	} as Partial<Request> as any as Request)) as StaticHandlerContext;

	const router = createStaticRouter(dataRoutes, ctx);

	const html = htmlTemplate.replace(
		'<div id="root"></div>',
		await renderToString(
			<div id='root'>
				<StaticRouterProvider router={router} context={ctx} />
			</div>,
		),
	);

	return html;
}
