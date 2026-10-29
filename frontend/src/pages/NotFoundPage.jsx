import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <p className="text-8xl font-bold text-gradient mb-4">404</p>
      <h1 className="text-2xl font-bold text-text mb-2">Page Not Found</h1>
      <p className="text-text-muted mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/">
          <Button icon={Home}>Go Home</Button>
        </Link>
        <Link to="/shop">
          <Button variant="outline" icon={Search}>Browse Shop</Button>
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
