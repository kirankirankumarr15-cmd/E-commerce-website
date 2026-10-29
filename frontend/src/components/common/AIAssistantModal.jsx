import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Sparkles, Star, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

const STORAGE_KEY = 'nova_mart_ai_saved_prompts';

const dressOptions = [
  'Dress',
  'Gown',
  'Kurti',
  'Saree',
  'Co-ord Set',
  'Jumpsuit',
  'Jacket',
  'Party Wear',
];

const recommendedPrompts = [
  { label: 'Evening gown under ₹5000', budget: '5000', dressType: 'Gown', occasion: 'evening party' },
  { label: 'Casual maxi dress under ₹3000', budget: '3000', dressType: 'Dress', occasion: 'casual outing' },
  { label: 'Festive kurti under ₹2500', budget: '2500', dressType: 'Kurti', occasion: 'festival' },
];

const AIAssistantModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [budget, setBudget] = useState('');
  const [dressType, setDressType] = useState('Dress');
  const [occasion, setOccasion] = useState('');
  const [color, setColor] = useState('');
  const [savedPrompts, setSavedPrompts] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSavedPrompts(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedPrompts([]);
    }
  }, [isOpen]);

  const searchText = useMemo(() => {
    return [dressType, occasion, color].filter(Boolean).join(' ');
  }, [dressType, occasion, color]);

  const savePrompt = (prompt) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const next = [prompt, ...existing.filter((item) => item.label !== prompt.label)].slice(0, 5);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSavedPrompts(next);
    } catch {
      // ignore storage errors
    }
  };

  const handleApplyPrompt = (prompt) => {
    setBudget(prompt.budget || '');
    setDressType(prompt.dressType || 'Dress');
    setOccasion(prompt.occasion || '');
    setColor('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const query = searchText.trim();
    const params = new URLSearchParams();

    if (query) params.set('search', query);
    if (budget) params.set('maxPrice', budget);

    const prompt = {
      label: [query || dressType, budget ? `under ₹${budget}` : '', occasion].filter(Boolean).join(' '),
      budget,
      dressType,
      occasion,
      color,
    };

    savePrompt(prompt);

    navigate(`/shop?${params.toString()}`);
    onClose();
    toast.success('Style search saved and ready to browse');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Style Finder" size="lg">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-2 rounded-xl bg-primary-50 border border-primary-100 px-3 py-2 text-sm text-primary-700">
            <Sparkles className="h-4 w-4" />
            Tell the assistant what kind of dress you want and your budget.
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Dress Type</span>
              <select
                value={dressType}
                onChange={(e) => setDressType(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-secondary px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {dressOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Budget (₹)</span>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="3000"
                className="w-full rounded-xl border border-border bg-surface-secondary px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Occasion</span>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Party, wedding, office"
                className="w-full rounded-xl border border-border bg-surface-secondary px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Color preference</span>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Red, black, beige"
                className="w-full rounded-xl border border-border bg-surface-secondary px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-border bg-surface-secondary p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-text">
              <Wand2 className="h-4 w-4 text-primary-600" />
              Suggested style prompts
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendedPrompts.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleApplyPrompt(item)}
                  className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" icon={ArrowRight}>
              Find My Style
            </Button>
          </div>
        </form>

        {savedPrompts.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface-secondary p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-text">
              <Star className="h-4 w-4 text-amber-500" />
              Saved style messages
            </div>
            <div className="space-y-2">
              {savedPrompts.map((item, index) => (
                <button
                  key={`${item.label}-${index}`}
                  type="button"
                  onClick={() => handleApplyPrompt(item)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-3 py-2 text-left text-sm text-text hover:bg-surface-tertiary"
                >
                  <span>{item.label}</span>
                  <span className="text-primary-600">Use</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIAssistantModal;
