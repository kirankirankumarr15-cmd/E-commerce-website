import { motion } from 'framer-motion';
import { classNames } from '../../utils/helpers';

const variants = {
  primary: 'bg-[#ffd814] text-[#0f1111] hover:bg-[#f7ca00] border border-[#fcd200] shadow-sm font-medium',
  secondary: 'bg-[#ffa41c] text-[#0f1111] hover:bg-[#fa8900] border border-[#ff8f00] shadow-sm font-medium',
  outline: 'bg-white border border-[#d5d9d9] text-[#0f1111] hover:bg-[#f7fafa] shadow-sm',
  ghost: 'text-[#0f1111] hover:bg-neutral-100',
  danger: 'bg-[#cc0c39] text-white hover:bg-red-700 shadow-sm',
  success: 'bg-[#007600] text-white hover:bg-emerald-700 shadow-sm',
  'amazon-yellow': 'bg-[#ffd814] text-[#0f1111] hover:bg-[#f7ca00] border border-[#fcd200] shadow-sm font-medium',
  'amazon-orange': 'bg-[#ffa41c] text-[#0f1111] hover:bg-[#fa8900] border border-[#ff8f00] shadow-sm font-medium',
  'amazon-white': 'bg-white text-[#0f1111] hover:bg-[#f7fafa] border border-[#d5d9d9] shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-full',
  md: 'px-4 py-2 text-sm rounded-full',
  lg: 'px-6 py-2.5 text-sm rounded-full font-medium',
  xl: 'px-8 py-3 text-base rounded-full font-medium',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.01 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.99 } : {}}
      className={classNames(
        'inline-flex items-center justify-center gap-2 transition-colors duration-150 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="h-4 w-4" aria-hidden="true" />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
