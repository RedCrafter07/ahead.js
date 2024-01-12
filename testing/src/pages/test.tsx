// import { Link, useLocation } from 'ahead.js/client';

import { Link, useLocation } from 'react-router-dom';

export default function () {
	const location = useLocation();
	return (
		<div className='container mx-auto p-2'>
			<p>Test page at {location.pathname}</p>
			<br />
			<Link to='/'>
				<button className='bg-zinc-800 p-2 rounded-lg'>Go back!</button>
			</Link>
		</div>
	);
}
