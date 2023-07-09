import { Server } from 'socket.io';
import { io, Socket } from 'socket.io-client';

class DevSocketServer {
	started: boolean = false;
	port: number = 4000;
	io?: Server;

	constructor(port: number) {
		this.port = port;
	}

	start() {
		if (this.started) return this;
		this.started = true;

		const io = new Server(this.port, {});

		this.io = io;
	}

	reload() {
		if (!this.io) return;
		this.io?.emit('reload');
	}

	stop() {
		if (!this.started) return;
		if (!this.io) return;
		this.io?.close();

		this.started = false;

		return this;
	}
}
