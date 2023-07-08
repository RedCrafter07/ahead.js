import { useParams } from 'ahead.js/client';

export default function ProjectPage() {
	const { id } = useParams();
	return <>This is a project page for {id}!</>;
}
