import { PackageOpen } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  description = 'Check back later for new items.',
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 rounded-full bg-surface-tertiary flex items-center justify-center mb-4">
      <Icon className="h-8 w-8 text-text-muted" aria-hidden="true" />
    </div>
    <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
    <p className="text-text-muted max-w-sm mb-6">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction}>{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;
