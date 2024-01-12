import { Location, RouterProvider, createBrowserRouter } from 'react-router-dom';

export type ComponentProps = { content: any; path: Location };

export default function Component(props: ComponentProps) {
	const router = createBrowserRouter(props.content);
	return <RouterProvider router={router} />;
}

export type Component = typeof Component;
