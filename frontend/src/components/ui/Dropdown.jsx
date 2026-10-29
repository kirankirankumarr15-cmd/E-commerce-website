import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames } from '../../utils/helpers';

const Dropdown = ({ trigger, children, align = 'right', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={classNames(
              'absolute z-50 mt-2 min-w-[200px] bg-surface rounded-xl border border-border shadow-lg py-1',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <div onClick={() => setIsOpen(false)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={classNames(
      'w-full text-left px-4 py-2.5 text-sm text-text hover:bg-surface-tertiary transition-colors',
      className
    )}
  >
    {children}
  </button>
);

export const SelectDropdown = ({ value, onChange, options, label }) => (
  <Dropdown
    trigger={
      <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm hover:bg-surface-secondary transition-colors">
        {label && <span className="text-text-muted">{label}:</span>}
        <span className="font-medium">{options.find((o) => o.value === value)?.label}</span>
        <ChevronDown className="h-4 w-4 text-text-muted" />
      </button>
    }
  >
    {options.map((option) => (
      <DropdownItem
        key={option.value}
        onClick={() => onChange(option.value)}
        className={value === option.value ? 'bg-primary-50 text-primary-700' : ''}
      >
        {option.label}
      </DropdownItem>
    ))}
  </Dropdown>
);

export default Dropdown;
