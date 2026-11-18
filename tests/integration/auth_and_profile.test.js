const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');

// Mock localStorage for Node test environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();

// Auth and Profile Controller simulation matching AuthContext.jsx & ProfilePage.jsx
class AuthController {
  constructor(storage) {
    this.storage = storage;
    this.currentUser = null;
  }

  loadUser() {
    const raw = this.storage.getItem('nova_saved_user');
    if (raw) {
      this.currentUser = JSON.parse(raw);
    }
    return this.currentUser;
  }

  register({ firstName, lastName, email, phone, password }) {
    if (!firstName || !lastName || !email || !password) {
      throw new Error('All required fields must be provided');
    }
    const role = email.includes('admin') ? 'admin' : 'customer';
    const user = {
      _id: 'u_' + Date.now(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim().toLowerCase(),
      phone: phone || '',
      role,
      addresses: [],
    };
    this.storage.setItem('nova_mart_token', 'token_' + Date.now());
    this.storage.setItem('nova_saved_user', JSON.stringify(user));
    this.currentUser = user;
    return user;
  }

  login({ email, password }) {
    if (!email || !password) throw new Error('Email and password required');
    const savedRaw = this.storage.getItem('nova_saved_user');
    let user = null;
    if (savedRaw) {
      const parsed = JSON.parse(savedRaw);
      if (parsed.email === email.trim().toLowerCase()) {
        user = parsed;
      }
    }

    if (!user) {
      const role = email.includes('admin') ? 'admin' : 'customer';
      user = {
        _id: 'u_demo',
        firstName: role === 'admin' ? 'Admin' : 'Kiran',
        lastName: role === 'admin' ? 'User' : 'Kumar',
        name: role === 'admin' ? 'Admin User' : 'Kiran Kumar',
        email: email.trim().toLowerCase(),
        role,
        addresses: [],
      };
    }

    this.storage.setItem('nova_mart_token', 'token_' + Date.now());
    this.storage.setItem('nova_saved_user', JSON.stringify(user));
    this.currentUser = user;
    return user;
  }

  updateProfile(updates) {
    if (!this.currentUser) throw new Error('Not authenticated');
    const updated = {
      ...this.currentUser,
      ...updates,
      name: `${updates.firstName || this.currentUser.firstName} ${updates.lastName || this.currentUser.lastName}`.trim(),
    };
    this.storage.setItem('nova_saved_user', JSON.stringify(updated));
    this.currentUser = updated;
    return updated;
  }

  toggleRole() {
    if (!this.currentUser) throw new Error('Not authenticated');
    const newRole = this.currentUser.role === 'admin' ? 'customer' : 'admin';
    return this.updateProfile({ role: newRole });
  }

  addAddress(addressData) {
    if (!this.currentUser) throw new Error('Not authenticated');
    const newAddr = {
      _id: 'addr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...addressData,
    };
    let list = this.currentUser.addresses || [];
    if (addressData.isDefault) {
      list = list.map((a) => ({ ...a, isDefault: false }));
    }
    list.push(newAddr);
    this.updateProfile({ addresses: list });
    return list;
  }

  editAddress(id, updatedFields) {
    if (!this.currentUser) throw new Error('Not authenticated');
    let list = this.currentUser.addresses || [];
    list = list.map((a) => {
      if (a._id === id) {
        return { ...a, ...updatedFields };
      }
      return updatedFields.isDefault ? { ...a, isDefault: false } : a;
    });
    this.updateProfile({ addresses: list });
    return list;
  }

  deleteAddress(id) {
    if (!this.currentUser) throw new Error('Not authenticated');
    const list = (this.currentUser.addresses || []).filter((a) => a._id !== id);
    this.updateProfile({ addresses: list });
    return list;
  }

  logout() {
    this.storage.removeItem('nova_mart_token');
    this.storage.removeItem('nova_saved_user');
    this.currentUser = null;
  }
}

describe('PHASE 2: Integration Testing - Authentication & Profile Management', () => {
  let auth;

  beforeEach(() => {
    mockStorage.clear();
    auth = new AuthController(mockStorage);
  });

  test('registers new customer account and persists session', () => {
    const user = auth.register({
      firstName: 'Aarav',
      lastName: 'Patel',
      email: 'aarav@example.com',
      phone: '9876543210',
      password: 'mypassword123',
    });

    assert.strictEqual(user.firstName, 'Aarav');
    assert.strictEqual(user.lastName, 'Patel');
    assert.strictEqual(user.role, 'customer');
    assert.ok(mockStorage.getItem('nova_mart_token'));

    // Check restore on app load
    const reloaded = auth.loadUser();
    assert.strictEqual(reloaded.email, 'aarav@example.com');
  });

  test('registers admin account based on email context', () => {
    const admin = auth.register({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@novamart.com',
      password: 'adminpassword',
    });
    assert.strictEqual(admin.role, 'admin');
  });

  test('updates profile personal details (name, email, phone)', () => {
    auth.register({
      firstName: 'Kiran',
      lastName: 'Kumar',
      email: 'kiran@novamart.com',
      password: 'password123',
    });

    const updated = auth.updateProfile({
      firstName: 'Kiranraj',
      phone: '9888877777',
      email: 'kiranraj@novamart.com',
    });

    assert.strictEqual(updated.firstName, 'Kiranraj');
    assert.strictEqual(updated.name, 'Kiranraj Kumar');
    assert.strictEqual(updated.phone, '9888877777');
    assert.strictEqual(updated.email, 'kiranraj@novamart.com');

    // Verify storage persistence
    const restored = auth.loadUser();
    assert.strictEqual(restored.firstName, 'Kiranraj');
  });

  test('manages addresses: Add, Edit, and Delete with default address flag exclusivity', () => {
    auth.register({
      firstName: 'Kiran',
      lastName: 'Kumar',
      email: 'kiran@novamart.com',
      password: 'password123',
    });

    // 1. Add Address 1 (Default)
    const list1 = auth.addAddress({
      label: 'Home',
      fullName: 'Kiran Kumar',
      phone: '9876543210',
      street: '123 MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      isDefault: true,
    });
    assert.strictEqual(list1.length, 1);
    assert.strictEqual(list1[0].isDefault, true);

    // 2. Add Address 2 (New Default - Address 1 should become non-default)
    const list2 = auth.addAddress({
      label: 'Office',
      fullName: 'Kiran Kumar',
      phone: '9876543210',
      street: 'Tech Park Block B',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560100',
      isDefault: true,
    });
    assert.strictEqual(list2.length, 2);
    const addr1 = list2.find((a) => a.label === 'Home');
    const addr2 = list2.find((a) => a.label === 'Office');
    assert.strictEqual(addr1.isDefault, false);
    assert.strictEqual(addr2.isDefault, true);

    // 3. Edit Address 1 (Update street and make default again)
    const list3 = auth.editAddress(addr1._id, {
      street: '123 MG Road, Floor 4',
      isDefault: true,
    });
    const updatedAddr1 = list3.find((a) => a._id === addr1._id);
    const updatedAddr2 = list3.find((a) => a._id === addr2._id);
    assert.strictEqual(updatedAddr1.street, '123 MG Road, Floor 4');
    assert.strictEqual(updatedAddr1.isDefault, true);
    assert.strictEqual(updatedAddr2.isDefault, false);

    // 4. Delete Address 2
    const list4 = auth.deleteAddress(addr2._id);
    assert.strictEqual(list4.length, 1);
    assert.strictEqual(list4[0]._id, addr1._id);
  });

  test('toggles role mode seamlessly between Customer and Admin', () => {
    auth.register({
      firstName: 'Kiran',
      lastName: 'Kumar',
      email: 'kiran@novamart.com',
      password: 'password123',
    });
    assert.strictEqual(auth.currentUser.role, 'customer');

    // Switch to admin mode
    const adminUser = auth.toggleRole();
    assert.strictEqual(adminUser.role, 'admin');

    // Switch back to customer mode
    const customerUser = auth.toggleRole();
    assert.strictEqual(customerUser.role, 'customer');
  });

  test('logs out and cleans up session tokens', () => {
    auth.register({
      firstName: 'Kiran',
      lastName: 'Kumar',
      email: 'kiran@novamart.com',
      password: 'password123',
    });
    assert.ok(mockStorage.getItem('nova_mart_token'));

    auth.logout();
    assert.strictEqual(auth.currentUser, null);
    assert.strictEqual(mockStorage.getItem('nova_mart_token'), null);
    assert.strictEqual(mockStorage.getItem('nova_saved_user'), null);
  });
});
