import React from 'react';
import { Component } from '../client/Component';

// type functionParams = { Component: Component; props: any };
type functionParams = { content: any };
export type Index = (params: functionParams) => JSX.Element;
