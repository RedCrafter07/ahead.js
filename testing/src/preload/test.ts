import { Preload } from 'ahead.js';
import express from 'express';

const preload: Preload = (app) => {
	app.get('/noteboards', (req, res) => {
		res.send('Hello World!');
	});

	return app;
};

export default preload;
