import { Preload } from 'ahead.js';
import { Server } from 'socket.io';

const preload: Preload = ({ app, server }) => {
	const io = new Server(server, {
		transports: ['websocket'],
	});

	io.on('connection', (socket) => {
		socket.send('Hello World!');
	});

	return { app, server };
};

export default preload;
