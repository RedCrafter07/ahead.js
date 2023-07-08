import { Component, ComponentProps } from '../lib/client/Component';

type functionParams = { Router: Component; props: ComponentProps };
export type Index = (params: functionParams) => JSX.Element;
