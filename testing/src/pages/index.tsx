import { useNavigate } from 'react-router-dom';
import Counter from '../components/Counter';
import { io } from 'socket.io-client';
import { useEffect } from 'react';

export default function Home() {
	const navigate = useNavigate();

	useEffect(() => {
		const socket = io('http://localhost:3000', {
			transports: ['websocket'],
		});

		socket.on('connect', () => {
			console.log('Connected!');
		});

		socket.connect();
	}, []);

	return (
		<div>
			<title>Home</title>
			<div className='p-2 container mx-auto'>
				<p className='text-3xl'>This is a test!</p>
				<button
					onClick={() => navigate('/test')}
					className='p-2 bg-green-600 rounded-lg text-white hover:opacity-90 active:scale-95 transition-all duration-75'
				>
					A button!
				</button>

				<br />

				<Counter />
			</div>
		</div>
	);
}
