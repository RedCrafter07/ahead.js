import { useParams } from 'react-router-dom';

export default function ProjectPage() {
	const { id } = useParams();
	return <>This is a project page for {id}!</>;
}
