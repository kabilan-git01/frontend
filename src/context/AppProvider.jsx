import { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/helpers';
import { membershipPlans as defaultPlans } from '../data/plans';
import { trainers as defaultTrainers } from '../data/trainers';
import { testimonials as defaultTestimonials, galleryImages as defaultGallery } from '../data/testimonials';
import { programs as defaultPrograms } from '../data/programs';
import supabase from '../supabaseClient.js';

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

const defaultHomeFeatures = [
  { id: 'feat-1', icon: 'fa-dumbbell', title: 'Elite Equipment', desc: 'Industry-leading hammer strength plate loaders, competition-grade barbells, and customized squat cells.' },
  { id: 'feat-2', icon: 'fa-user-shield', title: 'Expert Coaching', desc: 'Fully certified trainers with specialty designations in corrective biomechanics and sports nutrition.' },
  { id: 'feat-3', icon: 'fa-clock', title: '24/7 Facility Access', desc: 'Keycard entry system provides Elite and VIP members with full-facility access around the clock.' },
  { id: 'feat-4', icon: 'fa-apple-whole', title: 'Diet Strategies', desc: 'Direct nutritional support, custom macros allocations, and daily accountability checks.' },
];

const defaultAboutStory = {
  id: 'story-main',
  subtitle: 'Since 2015',
  title: 'Built On Grit & Performance',
  image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  paragraphs: [
    'Titan Fitness Gym was founded with a singular vision: create a training environment where serious athletes and everyday warriors alike could push beyond their perceived limits in a premium, high-intensity atmosphere.',
    'Our 15,000 sq ft facility houses competition-grade equipment, dedicated CrossFit zones, private coaching suites, and recovery amenities including saunas and cold plunge pools.',
    'With over 10,000 members transformed and a team of 20+ certified coaches, Titan has become the benchmark for premium fitness in the region.'
  ]
};

const defaultAboutStats = [
  { id: 'stat-1', num: '10K+', label: 'Members Transformed' },
  { id: 'stat-2', num: '20+', label: 'Expert Coaches' },
  { id: 'stat-3', num: '15K', label: 'Sq Ft Facility' },
  { id: 'stat-4', num: '24/7', label: 'VIP Access' },
];

const defaultContactInfo = [
  { id: 'contact-1', icon: 'fa-location-dot', title: 'Location', text: '123 Iron Street, San Francisco, CA 94102' },
  { id: 'contact-2', icon: 'fa-phone', title: 'Phone', text: '+1 (555) 123-4567' },
  { id: 'contact-3', icon: 'fa-envelope', title: 'Email', text: 'info@titanfitness.com' },
  { id: 'contact-4', icon: 'fa-clock', title: 'Hours', text: 'Mon-Fri: 5AM-11PM | Sat-Sun: 6AM-9PM' },
];

const defaultGymHours = [
  { id: 'hour-1', day: 'Mon - Fri', time: '05:00 - 23:00', isRed: false },
  { id: 'hour-2', day: 'Saturday', time: '06:00 - 21:00', isRed: false },
  { id: 'hour-3', day: 'Sunday', time: '08:00 - 18:00', isRed: false },
  { id: 'hour-4', day: 'Sauna Access', time: '24 Hours', isRed: true },
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
  const [programs, setPrograms] = useState(defaultPrograms);
  const [gallery, setGallery] = useState(defaultGallery);

  const [homeFeatures, setHomeFeatures] = useState(defaultHomeFeatures);
  const [aboutStory, setAboutStory] = useState(defaultAboutStory);
  const [aboutStats, setAboutStats] = useState(defaultAboutStats);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [gymHours, setGymHours] = useState(defaultGymHours);

  // Sync with Supabase on mount
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const { data: pData, error: pErr } = await supabase.from('programs').select('*');
        if (!pErr && pData && pData.length > 0) setPrograms(pData);
      } catch (e) { console.error('Error fetching programs:', e); }

      try {
        const { data: plData, error: plErr } = await supabase.from('plans').select('*');
        if (!plErr && plData && plData.length > 0) setPlans(plData);
      } catch (e) { console.error('Error fetching plans:', e); }

      try {
        const { data: tData, error: tErr } = await supabase.from('trainers').select('*');
        if (!tErr && tData && tData.length > 0) setTrainers(tData);
      } catch (e) { console.error('Error fetching trainers:', e); }

      try {
        const { data: rData, error: rErr } = await supabase.from('testimonials').select('*');
        if (!rErr && rData && rData.length > 0) setReviews(rData);
      } catch (e) { console.error('Error fetching reviews:', e); }

      try {
        const { data: gData, error: gErr } = await supabase.from('gallery_images').select('*');
        if (!gErr && gData && gData.length > 0) setGallery(gData);
      } catch (e) { console.error('Error fetching gallery_images:', e); }

      try {
        const { data: eData, error: eErr } = await supabase.from('enquiries').select('*');
        if (!eErr && eData && eData.length > 0) setEnquiries(eData);
      } catch (e) { console.error('Error fetching enquiries:', e); }

      try {
        const { data: mData, error: mErr } = await supabase.from('members').select('*');
        if (!mErr && mData && mData.length > 0) setMembers(mData);
      } catch (e) { console.error('Error fetching members:', e); }

      try {
        const { data: hfData, error: hfErr } = await supabase.from('home_features').select('*');
        if (!hfErr && hfData && hfData.length > 0) setHomeFeatures(hfData);
      } catch (e) { console.error('Error fetching home_features:', e); }

      try {
        const { data: absData, error: absErr } = await supabase.from('about_story').select('*');
        if (!absErr && absData && absData.length > 0) {
          const mainStory = absData.find(row => row.id === 'story-main') || absData[0];
          if (mainStory) setAboutStory(mainStory);
        }
      } catch (e) { console.error('Error fetching about_story:', e); }

      try {
        const { data: abstData, error: abstErr } = await supabase.from('about_stats').select('*');
        if (!abstErr && abstData && abstData.length > 0) setAboutStats(abstData);
      } catch (e) { console.error('Error fetching about_stats:', e); }

      try {
        const { data: ciData, error: ciErr } = await supabase.from('contact_info').select('*');
        if (!ciErr && ciData && ciData.length > 0) setContactInfo(ciData);
      } catch (e) { console.error('Error fetching contact_info:', e); }

      try {
        const { data: ghData, error: ghErr } = await supabase.from('gym_hours').select('*');
        if (!ghErr && ghData && ghData.length > 0) {
          const mappedGh = ghData.map(item => ({
            id: item.id,
            day: item.day,
            time: item.time,
            isRed: item.isRed
          }));
          setGymHours(mappedGh);
        }
      } catch (e) { console.error('Error fetching gym_hours:', e); }
    };
    fetchSupabaseData();
  }, []);


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
    const foundMember = members.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (foundMember) {
      const user = { id: foundMember.id, name: foundMember.name, email, role: 'member' };
      setAuth({ user, isAuthenticated: true, role: 'member' });
      return { success: true, role: 'member' };
    }
    if (email && password) {
      const user = { id: generateId(), name: email.split('@')[0], email, role: 'member' };
      setAuth({ user, isAuthenticated: true, role: 'member' });
      return { success: true, role: 'member' };
    }
    return { success: false, error: 'Invalid credentials' };
  }, [setAuth, members]);

  const logout = useCallback(() => {
    setAuth({ user: null, isAuthenticated: false, role: 'guest' });
  }, [setAuth]);

  const register = useCallback(async (name, email, password) => {
    if (!name || !email || !password) return { success: false, error: 'All fields required' };
    const newMember = { id: generateId(), name, email, plan: 'Basic Plan', joinDate: new Date().toISOString().split('T')[0], status: 'active' };
    setMembers((prev) => [...prev, newMember]);
    try {
      await supabase.from('members').insert(newMember);
    } catch (e) {
      console.error('Error saving registered member to Supabase:', e);
    }
    const user = { id: newMember.id, name, email, role: 'member' };
    setAuth({ user, isAuthenticated: true, role: 'member' });
    return { success: true };
  }, [setAuth, setMembers]);

  const addEnquiry = useCallback(async (enquiry) => {
    const newEnquiry = { ...enquiry, id: generateId(), date: new Date().toISOString().split('T')[0], status: 'new' };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    try {
      await supabase.from('enquiries').insert(newEnquiry);
    } catch (e) {
      console.error('Error inserting enquiry to Supabase:', e);
    }
  }, [setEnquiries]);

  const updateEnquiryStatus = useCallback(async (id, status) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    try {
      await supabase.from('enquiries').update({ status }).eq('id', id);
    } catch (e) {
      console.error('Error updating enquiry status in Supabase:', e);
    }
  }, [setEnquiries]);

  const addReview = useCallback(async (review) => {
    const newReview = { ...review, id: generateId() };
    setReviews((prev) => [newReview, ...prev]);
    try {
      await supabase.from('testimonials').insert(newReview);
    } catch (e) {
      console.error('Error inserting testimonial in Supabase:', e);
    }
  }, [setReviews]);

  const deleteReview = useCallback(async (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await supabase.from('testimonials').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting testimonial in Supabase:', e);
    }
  }, [setReviews]);

  const addMember = useCallback(async (member) => {
    const newMember = { ...member, id: generateId(), joinDate: new Date().toISOString().split('T')[0], status: 'active' };
    setMembers((prev) => [...prev, newMember]);
    try {
      await supabase.from('members').insert(newMember);
    } catch (e) {
      console.error('Error inserting member in Supabase:', e);
    }
  }, [setMembers]);

  const deleteMember = useCallback(async (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    try {
      await supabase.from('members').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting member in Supabase:', e);
    }
  }, [setMembers]);

  const updatePlan = useCallback(async (id, updates) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      await supabase.from('plans').update(updates).eq('id', id);
    } catch (e) {
      console.error('Error updating plan in Supabase:', e);
    }
  }, [setPlans]);

  const updateTrainer = useCallback(async (id, updates) => {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      await supabase.from('trainers').update(updates).eq('id', id);
    } catch (e) {
      console.error('Error updating trainer in Supabase:', e);
    }
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
    programs, gallery,
    homeFeatures, aboutStory, aboutStats, contactInfo, gymHours,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

