import { Server } from 'socket.io';
import { io, Socket } from 'socket.io-client';

class DevSocketServer {
	protected started: boolean = false;
	protected port: number = 4000;
	private io?: Server;

	constructor(port: number) {
		this.port = port;
	}

	start() {
		if (this.started) return this;
		this.started = true;

		const io = new Server(this.port, {
			transports: ['websocket'],
		});

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

class DevSocketClient {
	private client: Socket;
	protected port: number;

	constructor(port: number) {
		this.client = io(`http://localhost:${port}`, {
			transports: ['websocket'],
		});
		this.port = port;

		this.client.on('reload', () => {
			window.location.reload();
		});
	}
}

export { DevSocketServer, DevSocketClient };
