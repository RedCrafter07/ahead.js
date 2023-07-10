import { io, Socket } from 'socket.io-client';

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

export { DevSocketClient };
