import { Preload } from 'ahead.js';
import express from 'express';

const preload: Preload = (app) => {
	app.get('/noteboards', (req, res) => {
		res.send('Hello there!');
	});

	return app;
};

export default preload;
