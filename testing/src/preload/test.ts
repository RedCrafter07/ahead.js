import { Preload } from 'ahead.js';

const preload: Preload = (app) => {
	app.get('/noteboards', (req, res) => {
		res.send('Hello there!');
	});

	return app;
};

export default preload;
