import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Plus, Trash2, Pencil, ShieldCheck, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addresses, setAddresses] = useState(user?.addresses || []);

  const [addressFormData, setAddressFormData] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAddresses(user.addresses || []);
    }
  }, [user, reset]);

  const onPersonalSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile({
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || user.name,
        email: data.email || user.email,
        phone: data.phone,
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async () => {
    const newRole = user?.role === 'admin' ? 'customer' : 'admin';
    try {
      await updateProfile({
        ...user,
        role: newRole,
      });
      localStorage.setItem('nova_demo_role', newRole);
      toast.success(`Switched to ${newRole === 'admin' ? 'Admin' : 'Customer'} Mode!`);
    } catch {
      toast.error('Could not switch role');
    }
  };

  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddressFormData({
      label: 'Home',
      fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      phone: user?.phone || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: addresses.length === 0,
    });
    setShowAddressForm(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressFormData({
      label: addr.label || 'Home',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      isDefault: !!addr.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    let updatedList = [];

    if (editingAddressId) {
      updatedList = addresses.map((a) => {
        if (a._id === editingAddressId) {
          return { ...a, ...addressFormData };
        }
        return addressFormData.isDefault ? { ...a, isDefault: false } : a;
      });
      toast.success('Address updated successfully!');
    } else {
      const newAddr = {
        _id: 'addr_' + Date.now(),
        ...addressFormData,
      };
      if (addressFormData.isDefault) {
        updatedList = addresses.map((a) => ({ ...a, isDefault: false }));
        updatedList.push(newAddr);
      } else {
        updatedList = [...addresses, newAddr];
      }
      toast.success('Address added successfully!');
    }

    setAddresses(updatedList);
    setShowAddressForm(false);
    setEditingAddressId(null);
    await updateProfile({ ...user, addresses: updatedList });
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    const updatedList = addresses.filter((a) => a._id !== id);
    setAddresses(updatedList);
    await updateProfile({ ...user, addresses: updatedList });
    toast.success('Address deleted');
  };

  const initials = `${user?.firstName?.[0] || 'K'}${user?.lastName?.[0] || 'K'}`.toUpperCase();

  return (
    <div className="container-narrow py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-bold text-text mb-8">My Profile</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: User Summary Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <div className="bg-surface rounded-2xl border border-border p-6 text-center">
            <div className="w-20 h-20 bg-[#232f3e] text-[#febd69] font-black text-2xl rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#febd69]">
              {initials}
            </div>
            <h2 className="font-semibold text-lg text-text">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-text-muted">{user?.email}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full capitalize">
              <ShieldCheck className="h-3.5 w-3.5" />
              {user?.role || 'customer'} Account
            </div>

            {/* Role Switcher Action */}
            <div className="mt-6 pt-5 border-t border-border space-y-2">
              <button
                type="button"
                onClick={handleToggleRole}
                className="w-full text-xs font-bold py-2 px-3 rounded-lg border border-border bg-surface hover:bg-neutral-100 text-text transition-colors flex items-center justify-center gap-1.5"
              >
                Switch to {user?.role === 'admin' ? 'Customer Mode' : 'Admin Mode'}
              </button>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block w-full text-center text-xs font-bold py-2.5 px-4 rounded-lg bg-[#ffd814] text-[#0f1111] hover:bg-yellow-400 border border-[#fcd200] shadow-sm transition-all"
                >
                  Open Admin Dashboard →
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Editable Information & Addresses */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Personal Information Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit(onPersonalSubmit)}
            className="bg-surface rounded-2xl border border-border p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text flex items-center gap-2">
                <User className="h-5 w-5 text-primary-600" /> Personal Information
              </h3>
              <span className="text-xs text-text-muted">Click Save Changes to update</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">First Name</label>
                <input
                  {...register('firstName')}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Last Name</label>
                <input
                  {...register('lastName')}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="btn-amazon-yellow !text-black !font-bold">
              Save Changes
            </Button>
          </motion.form>

          {/* 2. Saved Addresses with Add & Edit */}
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
              <Button size="sm" variant="outline" icon={Plus} onClick={openAddAddress}>
                Add Address
              </Button>
            </div>

            {/* Address Add/Edit Form */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="mb-6 p-5 bg-surface-secondary rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h4 className="font-bold text-sm text-text">
                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false);
                      setEditingAddressId(null);
                    }}
                    className="text-xs text-text-muted hover:text-text"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-text mb-1">Address Label</label>
                    <input
                      value={addressFormData.label}
                      onChange={(e) => setAddressFormData({ ...addressFormData, label: e.target.value })}
                      placeholder="e.g. Home, Office"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text mb-1">Full Name</label>
                    <input
                      value={addressFormData.fullName}
                      onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                      placeholder="Full Name"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text mb-1">Phone Number</label>
                    <input
                      value={addressFormData.phone}
                      onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                      placeholder="Phone"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text mb-1">Postal Code (PIN)</label>
                    <input
                      value={addressFormData.postalCode}
                      onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                      placeholder="PIN Code"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-text mb-1">Street Address</label>
                    <input
                      value={addressFormData.street}
                      onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                      placeholder="Flat, House no., Building, Street"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text mb-1">City</label>
                    <input
                      value={addressFormData.city}
                      onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                      placeholder="City"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text mb-1">State</label>
                    <input
                      value={addressFormData.state}
                      onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                      placeholder="State"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressFormData.isDefault}
                    onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                    className="rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                  <span>Set as default delivery address</span>
                </label>

                <div className="flex gap-2 pt-3">
                  <Button type="submit" size="sm" className="btn-amazon-yellow !text-black !font-bold">
                    {editingAddressId ? 'Save Changes' : 'Add Address'}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowAddressForm(false);
                      setEditingAddressId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Address List */}
            {addresses.length === 0 ? (
              <p className="text-sm text-text-muted">No saved addresses yet. Click &quot;Add Address&quot; above.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="flex items-start justify-between p-4 bg-surface-secondary rounded-xl border border-border/80 hover:border-primary-400 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-sm text-text">{addr.label || 'Address'}</span>
                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" /> Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-text">{addr.fullName} · {addr.phone}</p>
                      <p className="text-sm text-text-muted">
                        {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      {/* Edit Address Button */}
                      <button
                        type="button"
                        onClick={() => openEditAddress(addr)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white hover:bg-neutral-100 text-text transition-colors"
                        title="Edit address"
                      >
                        <Pencil className="h-3.5 w-3.5 text-primary-600" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Address Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="p-1.5 text-error hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors"
                        title="Delete address"
                        aria-label="Delete address"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <div className="flex gap-4">
            <Link to="/orders">
              <Button variant="outline">View Orders</Button>
            </Link>
            <Link to="/wishlist">
              <Button variant="outline">My Wishlist</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
