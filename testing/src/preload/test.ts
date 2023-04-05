import { Preload } from 'ahead.js';

const preload: Preload = ({ app, server }) => {
	app.get('/noteboards', (req, res) => {
		res.send('Hello there!');
	});

	return { app, server };
};

export default preload;
