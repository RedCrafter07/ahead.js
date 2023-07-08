import './index.css';
import { Index, useLocation } from 'ahead.js/client';
import { AnimatePresence, motion } from 'framer-motion';

const MyApp: Index = ({ Router, props }) => {
	const location = useLocation();

	return (
		<div>
			<AnimatePresence mode='wait' initial={false}>
				<motion.div
					key={location.pathname}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						duration: 0.2,
					}}
				>
					<Router {...props} />
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default MyApp;
