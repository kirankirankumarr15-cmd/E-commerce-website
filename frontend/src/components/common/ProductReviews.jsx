import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, BadgeCheck } from 'lucide-react';
import Button from '../ui/Button';
import { reviewService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const schema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
});

const StarRating = ({ value, onChange, readonly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={readonly}
        onClick={() => onChange?.(star)}
        className={readonly ? 'cursor-default' : 'cursor-pointer'}
        aria-label={`${star} star`}
      >
        <Star className={`h-5 w-5 ${star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productSlug, productId }) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  });

  const fetchReviews = () => {
    reviewService.getByProduct(productSlug)
      .then((res) => {
        setReviews(res.data.data);
        setSummary(res.data.summary);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [productSlug]);

  const onSubmit = async (data) => {
    try {
      await reviewService.create({ productId, rating, title: data.title, comment: data.comment });
      toast.success('Review submitted!');
      reset();
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text">Customer Reviews</h2>
          {summary && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(summary.averageRating)} readonly />
              <span className="text-sm text-text-muted">{summary.averageRating} ({summary.totalReviews} reviews)</span>
            </div>
          )}
        </div>
        {isAuthenticated && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-6 bg-surface-secondary rounded-xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <input {...register('title')} placeholder="Review title (optional)" className="w-full px-4 py-2 border border-border rounded-lg text-sm" />
          <textarea {...register('comment')} rows={4} placeholder="Share your experience..." className="w-full px-4 py-2 border border-border rounded-lg text-sm" />
          {errors.comment && <p className="text-error text-xs">{errors.comment.message}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm">Submit Review</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-surface-secondary rounded-xl animate-pulse" />)}</div>
      ) : reviews.length === 0 ? (
        <p className="text-text-muted text-sm">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 bg-surface border border-border rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{review.user?.firstName} {review.user?.lastName?.[0]}.</span>
                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-xs text-success"><BadgeCheck className="h-3 w-3" /> Verified Purchase</span>
                  )}
                </div>
                <StarRating value={review.rating} readonly />
              </div>
              {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
              <p className="text-sm text-text-muted">{review.comment}</p>
              <p className="text-xs text-text-muted mt-2">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
