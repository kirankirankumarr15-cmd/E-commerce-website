import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { authService } from '../services';
import { useToast } from '../context/ToastContext';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
});

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSubmitted(true);
      toast.info('Password reset functionality will be available in Phase 2.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary-600 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text">Forgot Password</h1>
          <p className="text-text-muted mt-2">
            {submitted
              ? 'If an account exists, you will receive reset instructions.'
              : 'Enter your email and we will send you reset instructions.'}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl border border-border p-6 lg:p-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input id="email" type="email" {...register('email')} className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>
            <Button type="submit" size="lg" loading={loading} className="w-full">Send Reset Link</Button>
          </form>
        ) : (
          <div className="bg-surface rounded-2xl border border-border p-6 lg:p-8 text-center">
            <p className="text-text-muted mb-4">Password reset via email will be available in Phase 2.</p>
            <Link to="/login"><Button>Back to Login</Button></Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
