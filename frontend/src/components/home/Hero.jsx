import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-400 rounded-full blur-3xl" />
    </div>

    <div className="container-narrow relative py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-white/90 text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Premium Shopping Experience
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Upgrade Your{' '}
            <span className="text-secondary-300">Everyday.</span>
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-lg">
            Discover products designed to make your everyday life better.
            Quality you can trust, delivered to your door.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop">
              <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-white/90">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/shop?new=true">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Collection
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop"
              alt="Smart watch collection"
              className="rounded-2xl shadow-2xl object-cover w-full h-64"
              loading="eager"
            />
            <img
              src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=500&fit=crop"
              alt="Wireless earbuds"
              className="rounded-2xl shadow-2xl object-cover w-full h-64 mt-8"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
