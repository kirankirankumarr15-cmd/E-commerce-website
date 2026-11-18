import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, KeyRound, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const passwordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const otpRequestSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

const LoginPage = () => {
  const { user, login, verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/home', { replace: true });
    }
  }, [user, navigate]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    setValue: setPasswordValue,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpRequestSubmit,
    setValue: setOtpValue,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: { email: '' },
  });

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login({ email: data.email, password: data.password });

      if (result?.requiresOtp) {
        setOtpStep(true);
        setOtpEmail(result.email);
        if (result.devOtp) setDevOtp(result.devOtp);
        toast.info(result.message || 'OTP sent to your email.');
        return;
      }

      toast.success('Welcome back!');
      navigate(result?.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      toast.error(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onOtpRequestSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login({ email: data.email });

      if (result?.requiresOtp) {
        setOtpStep(true);
        setOtpEmail(result.email);
        if (result.devOtp) setDevOtp(result.devOtp);
        toast.info(result.message || 'OTP sent to your email.');
        return;
      }

      toast.success('Welcome back!');
      navigate(result?.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      toast.error(err?.message || 'Failed to request OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const verifiedUser = await verifyOtp({ email: otpEmail, otp });
      toast.success('Welcome back!');
      navigate(verifiedUser?.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      toast.error(err?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setAuthMode('password');
    setPasswordValue('email', demoEmail);
    setPasswordValue('password', demoPassword);
    setLoading(true);
    try {
      const result = await login({ email: demoEmail, password: demoPassword });
      toast.success(`Logged in as ${result?.role === 'admin' ? 'Admin' : 'Customer'}!`);
      navigate(result?.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      toast.error(err?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text">Welcome Back</h1>
          <p className="text-text-muted mt-2">Sign in to your NOVA MART account</p>
        </div>

        {/* Password Login Flow */}
        {authMode === 'password' && (
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="bg-surface rounded-2xl border border-border p-6 lg:p-8 space-y-5"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  id="email"
                  type="email"
                  {...registerPassword('email')}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="customer@novamart.com"
                />
              </div>
              {passwordErrors.email && (
                <p className="text-error text-xs mt-1">{passwordErrors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-text">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...registerPassword('password')}
                  className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordErrors.password && (
                <p className="text-error text-xs mt-1">{passwordErrors.password.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Sign In
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('otp');
                  setOtpStep(false);
                }}
                className="text-xs text-primary-600 hover:underline"
              >
                Sign in with OTP instead
              </button>
            </div>
          </form>
        )}

        {/* OTP Login Flow */}
        {authMode === 'otp' && !otpStep && (
          <form
            onSubmit={handleOtpRequestSubmit(onOtpRequestSubmit)}
            className="bg-surface rounded-2xl border border-border p-6 lg:p-8 space-y-5"
          >
            <div>
              <label htmlFor="otp-email" className="block text-sm font-medium text-text mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  id="otp-email"
                  type="email"
                  {...registerOtp('email')}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="customer@novamart.com"
                />
              </div>
              {otpErrors.email && (
                <p className="text-error text-xs mt-1">{otpErrors.email.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Send OTP
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('password')}
                className="text-xs text-primary-600 hover:underline"
              >
                Sign in with Password instead
              </button>
            </div>
          </form>
        )}

        {/* OTP Verification Step */}
        {authMode === 'otp' && otpStep && (
          <form
            onSubmit={handleVerifyOtpSubmit}
            className="bg-surface rounded-2xl border border-border p-6 lg:p-8 space-y-5"
          >
            <div className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-700">
              OTP sent for <span className="font-semibold">{otpEmail}</span>
            </div>

            {devOtp && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-center justify-between">
                <span>
                  Demo/Dev Code: <strong className="font-mono text-sm tracking-wider">{devOtp}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtp(devOtp)}
                  className="text-amber-900 font-semibold underline hover:text-amber-700 ml-2"
                >
                  Auto-fill
                </button>
              </div>
            )}

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-text mb-1.5">
                Enter 6-Digit OTP
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Verify OTP & Log In
            </Button>

            <button
              type="button"
              onClick={() => {
                setOtpStep(false);
                setOtp('');
                setDevOtp('');
                setAuthMode('password');
              }}
              className="w-full text-sm text-primary-600 hover:underline"
            >
              Back to sign in
            </button>
          </form>
        )}

        {/* Demo Accounts Quick-Login Buttons */}
        <div className="mt-6 p-4 rounded-xl border border-border bg-surface-secondary/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
            Quick Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin('customer@novamart.com', 'customer123')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border bg-surface hover:bg-primary-50 hover:border-primary-300 text-text transition-colors disabled:opacity-50"
            >
              <UserCheck className="h-3.5 w-3.5 text-primary-600" />
              Customer
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin('admin@novamart.com', 'admin123')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border bg-surface hover:bg-primary-50 hover:border-primary-300 text-text transition-colors disabled:opacity-50"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-secondary-600" />
              Admin
            </button>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-text-muted mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
