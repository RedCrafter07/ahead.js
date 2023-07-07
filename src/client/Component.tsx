import { ReactNode } from 'react';

export default function Component(props: { children: ReactNode }) {
	return <>{props.children}</>;
}

export type Component = typeof Component;
