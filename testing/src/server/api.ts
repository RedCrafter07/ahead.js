import { Router } from 'ahead.js/server';

const router = Router();

router.get('/', (req, res) => {
	res.send('Hello World!');
});

export default router;
