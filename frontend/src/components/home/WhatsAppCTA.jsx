import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const WhatsAppCTA = () => (
  <section className="py-12 lg:py-16">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6"
      >
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Need Help? Chat With Us
          </h2>
          <p className="text-white/80 max-w-md">
            Get instant support on WhatsApp. Our team is ready to help you find the perfect products.
          </p>
        </div>
        <a
          href="https://wa.me/919876543210?text=Hi%20NOVA%20MART,%20I%20need%20help%20with..."
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            className="bg-white text-emerald-600 hover:bg-white/90 shadow-lg"
            icon={MessageCircle}
          >
            Chat on WhatsApp
          </Button>
        </a>
      </motion.div>
    </div>
  </section>
);

export default WhatsAppCTA;
