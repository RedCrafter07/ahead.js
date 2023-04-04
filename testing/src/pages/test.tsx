import { useLocation } from 'ahead.js/client';

export default function () {
	const location = useLocation();
	return <>Test page at {location.pathname}</>;
}
