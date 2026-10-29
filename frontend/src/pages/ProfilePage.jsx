import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Plus, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
      setAddresses(user.addresses || []);
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      label: form.label.value,
      fullName: form.fullName.value,
      phone: form.phone.value,
      street: form.street.value,
      city: form.city.value,
      state: form.state.value,
      postalCode: form.postalCode.value,
      country: 'India',
      isDefault: form.isDefault.checked,
    };
    try {
      const res = await authService.addAddress(data);
      setAddresses(res.data.data);
      setShowAddressForm(false);
      toast.success('Address added');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await authService.deleteAddress(id);
      setAddresses(res.data.data);
      toast.success('Address removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container-narrow py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-bold text-text mb-8">My Profile</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <div className="bg-surface rounded-2xl border border-border p-6 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <h2 className="font-semibold text-lg text-text">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-text-muted">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-surface rounded-2xl border border-border p-6 space-y-4"
          >
            <h3 className="font-semibold text-text flex items-center gap-2">
              <User className="h-5 w-5 text-primary-600" /> Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">First Name</label>
                <input {...register('firstName')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Last Name</label>
                <input {...register('lastName')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input value={user?.email || ''} disabled className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-surface-secondary text-text-muted" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input {...register('phone')} className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <Button type="submit" loading={loading}>Save Changes</Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface rounded-2xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-600" /> Saved Addresses
              </h3>
              <Button size="sm" variant="outline" icon={Plus} onClick={() => setShowAddressForm(!showAddressForm)}>
                Add Address
              </Button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-surface-secondary rounded-xl space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input name="label" placeholder="Label (Home, Office)" required className="px-3 py-2 border border-border rounded-lg text-sm" />
                  <input name="fullName" placeholder="Full Name" required className="px-3 py-2 border border-border rounded-lg text-sm" />
                  <input name="phone" placeholder="Phone" required className="px-3 py-2 border border-border rounded-lg text-sm" />
                  <input name="street" placeholder="Street Address" required className="px-3 py-2 border border-border rounded-lg text-sm sm:col-span-2" />
                  <input name="city" placeholder="City" required className="px-3 py-2 border border-border rounded-lg text-sm" />
                  <input name="state" placeholder="State" required className="px-3 py-2 border border-border rounded-lg text-sm" />
                  <input name="postalCode" placeholder="Postal Code" required className="px-3 py-2 border border-border rounded-lg text-sm" />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isDefault" /> Set as default address
                </label>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Save Address</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                </div>
              </form>
            )}

            {addresses.length === 0 ? (
              <p className="text-sm text-text-muted">No saved addresses yet.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr._id} className="flex items-start justify-between p-4 bg-surface-secondary rounded-xl">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-text">{addr.label}</span>
                        {addr.isDefault && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-sm text-text-muted">{addr.fullName} · {addr.phone}</p>
                      <p className="text-sm text-text-muted">{addr.street}, {addr.city}, {addr.state} {addr.postalCode}</p>
                    </div>
                    <button onClick={() => handleDeleteAddress(addr._id)} className="p-1.5 text-error hover:bg-red-50 rounded-lg" aria-label="Delete address">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <div className="flex gap-4">
            <Link to="/orders"><Button variant="outline">View Orders</Button></Link>
            <Link to="/wishlist"><Button variant="outline">My Wishlist</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
