import { useState } from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <section className="py-12 lg:py-16 bg-surface-secondary">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <Mail className="h-8 w-8 text-primary-600 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">
            Stay in the Loop
          </h2>
          <p className="text-text-muted mb-6">
            Subscribe to get exclusive deals, new arrivals, and shopping tips delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="submit" size="lg">Subscribe</Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
