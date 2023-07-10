import { Preload } from 'ahead.js';
import { Server } from 'socket.io';

const preload: Preload = ({ app, server }) => {
	const io = new Server(server, {
		transports: ['websocket'],
	});

	io.on('connection', (socket) => {
		console.log('a user connected');
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
	});

	return { app, server };
};

export default preload;
