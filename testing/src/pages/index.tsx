import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';

export default function Home() {
	const navigate = useNavigate();

	return (
		<div>
			<title>Home</title>
			<div className='p-2 container mx-auto flex flex-col gap-2'>
				<p className='text-3xl'>This is a test!</p>
				<button
					onClick={() => startTransition(() => navigate('/test'))}
					className='p-2 bg-green-600 rounded-lg text-white hover:opacity-90 active:scale-95 transition-all duration-75'
				>
					A button!
				</button>
			</div>
		</div>
	);
}
