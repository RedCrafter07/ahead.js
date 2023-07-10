import chalk from 'chalk';
import { Server } from 'socket.io';

class DevSocketServer {
	protected started: boolean = false;
	protected port: number = 4000;
	private io?: Server;
	protected lastReload: number = Date.now();

	constructor(port: number) {
		this.port = port;
	}

	start() {
		if (this.started) return this;
		this.started = true;

		const io = new Server(this.port, {
			transports: ['websocket'],
		});

		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			chalk.gray(`Hot reload server started on port ${this.port}.`),
		);

		io.on('connection', (socket) => {
			socket.emit('last', this.lastReload);
		});

		this.io = io;

		return this;
	}

	reload() {
		if (!this.io) return;
		console.log(
			chalk.hex('#0099ff').bold('[ahead]'),
			chalk.gray('Emitting reload...'),
		);
		this.io?.emit('reload');

		this.lastReload = Date.now();
	}

	stop() {
		if (!this.started) return;
		if (!this.io) return;
		this.io?.close();

		this.started = false;

		return this;
	}
}

export { DevSocketServer };
