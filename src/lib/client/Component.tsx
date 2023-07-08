import { Location, Routes } from 'react-router-dom';

export type ComponentProps = { content: any; path: Location };

export default function Component(props: ComponentProps) {
	return <Routes location={props.path}>{props.content}</Routes>;
}

export type Component = typeof Component;
