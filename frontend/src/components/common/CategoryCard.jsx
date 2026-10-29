import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.3 }}
  >
    <Link
      to={`/category/${category.slug}`}
      className="group block relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-secondary"
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
        {category.description && (
          <p className="text-sm text-white/80 line-clamp-2">{category.description}</p>
        )}
      </div>
    </Link>
  </motion.div>
);

export default CategoryCard;
