import './index.css';
import { Index } from 'ahead.js/client';

const MyApp: Index = ({ Router, props }) => {
    return (
        <div>
            <Router {...props} />
        </div>
    );
};

export default MyApp;
