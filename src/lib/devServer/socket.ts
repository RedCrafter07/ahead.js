import { io, Socket } from 'socket.io-client';

class DevSocketClient {
	private client: Socket;
	protected port: number;
	protected lastReload: number = Date.now();

	constructor(port: number) {
		this.client = io(`http://localhost:${port}`, {
			transports: ['websocket'],
			autoConnect: true,
			reconnection: true,
		});
		this.port = port;

		this.client.on('connect', () => {
			console.log(`[ahead] Socket connected on port ${this.port}.`);
		});

		this.client.on('last', (lastReload: number) => {
			if (lastReload > this.lastReload) {
				console.log(`[ahead] Reloading...`);
				window.location.reload();
				return;
			}
			this.lastReload = lastReload;
		});

		this.client.on('reload', () => {
			console.log(`[ahead] Reloading...`);
			window.location.reload();
		});
	}
}

export { DevSocketClient };
