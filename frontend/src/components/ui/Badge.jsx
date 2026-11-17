import { classNames } from '../../utils/helpers';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-tertiary text-text-muted',
    primary: 'bg-[#ffd814] text-[#0f1111] font-medium',
    success: 'bg-[#007600] text-white font-medium',
    warning: 'bg-[#de7921] text-white font-medium',
    error: 'bg-[#cc0c39] text-white font-medium',
    deal: 'bg-[#cc0c39] text-white font-bold tracking-tight',
    new: 'bg-[#232f3e] text-white font-medium',
    bestseller: 'bg-[#e67a00] text-white font-semibold',
    choice: 'bg-[#232f3e] text-white font-semibold',
    prime: 'bg-[#00a8e1] text-white font-bold italic',
  };

  return (
    <span
      className={classNames(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px]',
        variants[variant] || variants.default,
        className
      )}
    >
      {variant === 'prime' ? (
        <span className="flex items-center gap-1 font-bold">
          <span className="text-[#002f36] bg-white px-1 rounded-sm text-[9px] uppercase tracking-wider not-italic">
            prime
          </span>
          {children || 'delivery'}
        </span>
      ) : (
        children
      )}
    </span>
  );
};

export default Badge;
