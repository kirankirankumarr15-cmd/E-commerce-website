import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Priya Sharma',
    rating: 5,
    text: 'Absolutely love shopping at NOVA MART! The product quality is exceptional and delivery is always on time.',
    location: 'Mumbai',
  },
  {
    name: 'Rahul Verma',
    rating: 5,
    text: 'Best online shopping experience I have had. Great prices, genuine products, and excellent customer support.',
    location: 'Delhi',
  },
  {
    name: 'Ananya Patel',
    rating: 4,
    text: 'The website is so easy to use and the product images are accurate. My go-to store for electronics and fashion.',
    location: 'Bangalore',
  },
];

const Reviews = () => (
  <section className="py-12 lg:py-16">
    <div className="container-narrow">
      <div className="text-center mb-10">
        <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">
          What Our Customers Say
        </h2>
        <p className="text-text-muted">Trusted by thousands of happy shoppers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl p-6 border border-border"
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </div>
            <p className="text-text mb-4 text-sm leading-relaxed">&ldquo;{review.text}&rdquo;</p>
            <div>
              <p className="font-semibold text-text text-sm">{review.name}</p>
              <p className="text-xs text-text-muted">{review.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
