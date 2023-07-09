import { useState } from 'react';

export default function Counter() {
	const [count, setCount] = useState(0);

	return (
		<>
			<button
				className='p-2 bg-zinc-600 text-white rounded-lg'
				onClick={() => setCount((c) => c + 1)}
			>
				{count}
			</button>
		</>
	);
}
