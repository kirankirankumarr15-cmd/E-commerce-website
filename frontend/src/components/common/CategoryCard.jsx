import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.25 }}
    className="h-full"
  >
    <Link
      to={`/category/${category.slug}`}
      className="group block h-full bg-white rounded-md border border-[#e0e0e0] hover:border-[#b8b8b8] hover:shadow-md transition-all p-3 text-center flex flex-col justify-between"
    >
      <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 mb-2">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-[#0f1111] group-hover:text-[#c7511f] line-clamp-1 mb-0.5">
          {category.name}
        </h3>
        <span className="text-[11px] text-[#007185] group-hover:underline">
          Shop now
        </span>
      </div>
    </Link>
  </motion.div>
);

export default CategoryCard;
