import { classNames } from '../../utils/helpers';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-tertiary text-text-muted',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    deal: 'bg-red-500 text-white',
    new: 'bg-primary-600 text-white',
  };

  return (
    <span
      className={classNames(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
