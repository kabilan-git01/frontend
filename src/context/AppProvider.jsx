import { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/helpers';
import { membershipPlans as defaultPlans } from '../data/plans';
import { trainers as defaultTrainers } from '../data/trainers';
import { testimonials as defaultTestimonials } from '../data/testimonials';

const AppContext = createContext(null);

const defaultMembers = [
  { id: 'm1', name: 'Dave Miller', email: 'dave@email.com', plan: 'Elite Plan', joinDate: '2024-01-15', status: 'active' },
  { id: 'm2', name: 'Jessica Sterling', email: 'jessica@email.com', plan: 'VIP Plan', joinDate: '2024-06-20', status: 'active' },
  { id: 'm3', name: 'Ryan Reynolds', email: 'ryan@email.com', plan: 'Basic Plan', joinDate: '2025-08-01', status: 'active' },
];

const defaultEnquiries = [
  { id: 'e1', name: 'John Smith', email: 'john@email.com', subject: 'Elite Plan Inquiry', message: 'Interested in the Elite membership plan.', date: '2026-06-15', status: 'new' },
  { id: 'e2', name: 'Lisa Wong', email: 'lisa@email.com', subject: 'Personal Training', message: 'Looking for 1-on-1 sessions with James Wright.', date: '2026-06-18', status: 'read' },
];

export function AppProvider({ children }) {
  const [cart, setCart] = useLocalStorage(STORAGE_KEYS.CART, []);
  const [wishlist, setWishlist] = useLocalStorage(STORAGE_KEYS.WISHLIST, []);
  const [auth, setAuth] = useLocalStorage(STORAGE_KEYS.AUTH, { user: null, isAuthenticated: false, role: 'guest' });
  const [preferences, setPreferences] = useLocalStorage(STORAGE_KEYS.PREFERENCES, { billingPeriod: 'monthly', theme: 'dark' });
  const [plans, setPlans] = useLocalStorage(STORAGE_KEYS.PLANS, defaultPlans);
  const [trainers, setTrainers] = useLocalStorage(STORAGE_KEYS.TRAINERS, defaultTrainers);
  const [members, setMembers] = useLocalStorage(STORAGE_KEYS.MEMBERS, defaultMembers);
  const [enquiries, setEnquiries] = useLocalStorage(STORAGE_KEYS.ENQUIRIES, defaultEnquiries);
  const [reviews, setReviews] = useLocalStorage(STORAGE_KEYS.REVIEWS, defaultTestimonials);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.billingPeriod === item.billingPeriod);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.billingPeriod === item.billingPeriod
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1, cartId: generateId() }];
    });
  }, [setCart]);

  const removeFromCart = useCallback((cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  }, [setCart]);

  const updateCartQuantity = useCallback((cartId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)));
  }, [setCart]);

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const addToWishlist = useCallback((item) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.id === item.id && i.type === item.type)) return prev;
      return [...prev, { ...item, wishlistId: generateId() }];
    });
  }, [setWishlist]);

  const removeFromWishlist = useCallback((wishlistId) => {
    setWishlist((prev) => prev.filter((item) => item.wishlistId !== wishlistId));
  }, [setWishlist]);

  const isInWishlist = useCallback((id, type) => {
    return wishlist.some((item) => item.id === id && item.type === type);
  }, [wishlist]);

  const moveToCart = useCallback((wishlistId) => {
    const item = wishlist.find((i) => i.wishlistId === wishlistId);
    if (!item) return;
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      type: item.type,
      billingPeriod: preferences.billingPeriod,
      image: item.image,
    });
    removeFromWishlist(wishlistId);
  }, [wishlist, addToCart, removeFromWishlist, preferences.billingPeriod]);

  const login = useCallback((email, password) => {
    if (email === 'admin@titan.com' && password === 'admin123') {
      const user = { id: 'admin-1', name: 'Admin', email, role: 'admin' };
      setAuth({ user, isAuthenticated: true, role: 'admin' });
      return { success: true, role: 'admin' };
    }
    if (email && password) {
      const user = { id: generateId(), name: email.split('@')[0], email, role: 'member' };
      setAuth({ user, isAuthenticated: true, role: 'member' });
      return { success: true, role: 'member' };
    }
    return { success: false, error: 'Invalid credentials' };
  }, [setAuth]);

  const logout = useCallback(() => {
    setAuth({ user: null, isAuthenticated: false, role: 'guest' });
  }, [setAuth]);

  const register = useCallback((name, email, password) => {
    if (!name || !email || !password) return { success: false, error: 'All fields required' };
    const user = { id: generateId(), name, email, role: 'member' };
    setAuth({ user, isAuthenticated: true, role: 'member' });
    return { success: true };
  }, [setAuth]);

  const addEnquiry = useCallback((enquiry) => {
    setEnquiries((prev) => [{ ...enquiry, id: generateId(), date: new Date().toISOString().split('T')[0], status: 'new' }, ...prev]);
  }, [setEnquiries]);

  const updateEnquiryStatus = useCallback((id, status) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }, [setEnquiries]);

  const addReview = useCallback((review) => {
    setReviews((prev) => [{ ...review, id: generateId() }, ...prev]);
  }, [setReviews]);

  const deleteReview = useCallback((id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }, [setReviews]);

  const addMember = useCallback((member) => {
    setMembers((prev) => [...prev, { ...member, id: generateId(), joinDate: new Date().toISOString().split('T')[0], status: 'active' }]);
  }, [setMembers]);

  const deleteMember = useCallback((id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, [setMembers]);

  const updatePlan = useCallback((id, updates) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, [setPlans]);

  const updateTrainer = useCallback((id, updates) => {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, [setTrainers]);

  const value = {
    cart, cartCount, cartTotal, addToCart, removeFromCart, updateCartQuantity, clearCart,
    wishlist, wishlistCount, addToWishlist, removeFromWishlist, isInWishlist, moveToCart,
    auth, login, logout, register,
    preferences, setPreferences,
    plans, updatePlan,
    trainers, updateTrainer,
    members, addMember, deleteMember,
    enquiries, addEnquiry, updateEnquiryStatus,
    reviews, addReview, deleteReview,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
