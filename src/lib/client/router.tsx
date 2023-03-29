import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// @ts-ignore
import routes from '../routes.json';

const router = createBrowserRouter(routes);

export default function Router() {
	return <RouterProvider router={router} />;
}
