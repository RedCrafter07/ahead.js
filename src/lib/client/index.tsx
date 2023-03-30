import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Router from './router';

const root = hydrateRoot(document.getElementById('root')!, <Router />);
