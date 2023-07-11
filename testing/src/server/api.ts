import { Router } from 'ahead.js/server';

const router = Router();

router.get('/', (req, res) => {
	res.send('Hello World!');
});

router.get('/title', (req, res) => {
	res.send(Math.floor(Math.random() * 100));
});

export default router;
