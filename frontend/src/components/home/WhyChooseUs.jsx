import { Shield, Truck, RefreshCw, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders above ₹999 across India',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: '100% secure payment processing',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '7-day hassle-free return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated customer support team',
  },
];

const WhyChooseUs = () => (
  <section className="py-12 lg:py-16 bg-surface-secondary">
    <div className="container-narrow">
      <div className="text-center mb-10">
        <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">
          Why Choose NOVA MART
        </h2>
        <p className="text-text-muted">Shopping made simple, secure, and satisfying</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl p-6 text-center border border-border hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <feature.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-text mb-1">{feature.title}</h3>
            <p className="text-sm text-text-muted">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
