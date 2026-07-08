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
  const [authLoading, setAuthLoading] = useState(true);
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

  // Sync with Supabase Auth session on mount and listen to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const user = session.user;
        const role = user.email === 'admin@titan.com' || user.user_metadata?.role === 'admin' ? 'admin' : 'member';
        setAuth({
          user: {
            id: user.id,
            name: user.user_metadata?.name || user.email.split('@')[0],
            email: user.email,
            role: role
          },
          isAuthenticated: true,
          role: role
        });
      } else {
        // Mock Session Fallback Check
        const localAuthRaw = localStorage.getItem(STORAGE_KEYS.AUTH);
        if (localAuthRaw) {
          try {
            const localAuth = JSON.parse(localAuthRaw);
            if (localAuth && localAuth.isAuthenticated) {
              const isMockAdmin = localAuth.user?.email === 'admin@titan.com';
              const isMockMember = members.some((m) => m.email.toLowerCase() === localAuth.user?.email?.toLowerCase());
              if (isMockAdmin || isMockMember) {
                setAuth(localAuth);
                setAuthLoading(false);
                return;
              }
            }
          } catch (e) {
            console.error('Error parsing local auth:', e);
          }
        }
        setAuth({ user: null, isAuthenticated: false, role: 'guest' });
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const user = session.user;
        const role = user.email === 'admin@titan.com' || user.user_metadata?.role === 'admin' ? 'admin' : 'member';
        setAuth({
          user: {
            id: user.id,
            name: user.user_metadata?.name || user.email.split('@')[0],
            email: user.email,
            role: role
          },
          isAuthenticated: true,
          role: role
        });
      } else {
        // Mock Session Fallback Check
        const localAuthRaw = localStorage.getItem(STORAGE_KEYS.AUTH);
        if (localAuthRaw) {
          try {
            const localAuth = JSON.parse(localAuthRaw);
            if (localAuth && localAuth.isAuthenticated) {
              const isMockAdmin = localAuth.user?.email === 'admin@titan.com';
              const isMockMember = members.some((m) => m.email.toLowerCase() === localAuth.user?.email?.toLowerCase());
              if (isMockAdmin || isMockMember) {
                setAuthLoading(false);
                // Stay logged in as mock user
                return;
              }
            }
          } catch (e) {
            console.error('Error parsing local auth:', e);
          }
        }
        setAuth({ user: null, isAuthenticated: false, role: 'guest' });
      }
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, members]);

  // Sync with Supabase on mount
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const { data: pData, error: pErr } = await supabase.from('programs').select('*');
        if (!pErr && pData && pData.length > 0) {
          const mapped = pData.map(prog => {
            const def = defaultPrograms.find(p => p.id === prog.id) || {};
            return {
              ...def,
              ...prog,
              image: prog.image_url || prog.image || def.image,
              level: prog.difficulty || prog.level || def.level,
              price: prog.price ?? def.price ?? 49,
              highlights: prog.highlights || def.highlights || [],
            };
          });
          setPrograms(mapped);
        }
      } catch (e) { console.error('Error fetching programs:', e); }

      try {
        const { data: plData, error: plErr } = await supabase.from('membership_plans').select('*');
        if (!plErr && plData && plData.length > 0) {
          const mapped = plData.map(plan => {
            const def = defaultPlans.find(p => p.id === plan.id) || {};
            return {
              ...def,
              ...plan,
              pricing: {
                monthly: plan.monthly_price ?? def.pricing?.monthly ?? 0,
                quarterly: plan.quarterly_price ?? def.pricing?.quarterly ?? 0,
                yearly: plan.yearly_price ?? def.pricing?.yearly ?? 0,
              },
              features: plan.features || def.features || [],
            };
          });
          setPlans(mapped);
        }
      } catch (e) { console.error('Error fetching plans:', e); }

      try {
        const { data: tData, error: tErr } = await supabase.from('trainers').select('*');
        if (!tErr && tData && tData.length > 0) {
          const mapped = tData.map(trainer => {
            const def = defaultTrainers.find(t => t.id === trainer.id) || {};
            return {
              ...def,
              ...trainer,
              specialty: trainer.designation || trainer.specialty || def.specialty,
              image: trainer.image_url || trainer.image || def.image,
              sessionPrice: trainer.sessionPrice ?? def.sessionPrice ?? 50,
              rating: trainer.rating ?? def.rating ?? 5.0,
              sessionsCompleted: trainer.sessionsCompleted ?? def.sessionsCompleted ?? 100,
              certs: trainer.certs || def.certs || [],
              availability: trainer.availability || def.availability || [],
              programs: trainer.programs || def.programs || [],
              socials: {
                facebook: trainer.facebook || def.socials?.facebook || '#',
                twitter: trainer.twitter || def.socials?.twitter || '#',
                instagram: trainer.instagram || def.socials?.instagram || '#',
              },
            };
          });
          setTrainers(mapped);
        }
      } catch (e) { console.error('Error fetching trainers:', e); }

      try {
        const { data: rData, error: rErr } = await supabase.from('testimonials').select('*');
        if (!rErr && rData && rData.length > 0) {
          const mapped = rData.map(rev => {
            const def = defaultTestimonials.find(r => r.id === rev.id) || {};
            const isSuccessStory = rev.designation?.endsWith(' | success-story');
            const cleanDesignation = isSuccessStory ? rev.designation.replace(' | success-story', '') : rev.designation;
            return {
              ...def,
              ...rev,
              role: cleanDesignation || rev.role || def.role,
              avatar: rev.image_url || rev.avatar || def.avatar,
              quote: rev.review || rev.quote || def.quote,
              featured: rev.is_featured ?? rev.featured ?? true,
              type: isSuccessStory ? 'success-story' : (rev.type || def.type || 'testimonial'),
            };
          });
          setReviews(mapped);
        }
      } catch (e) { console.error('Error fetching reviews:', e); }

      try {
        const { data: gData, error: gErr } = await supabase.from('gallery').select('*');
        if (!gErr && gData && gData.length > 0) {
          const mapped = gData.map(img => {
            const def = defaultGallery.find(g => g.id === img.id) || {};
            return {
              ...def,
              ...img,
              src: img.image_url || img.src || def.src,
              alt: img.title || img.alt || def.alt,
            };
          });
          setGallery(mapped);
        }
      } catch (e) { console.error('Error fetching gallery:', e); }

      try {
        const { data: eData, error: eErr } = await supabase.from('contact_enquiries').select('*');
        if (!eErr && eData && eData.length > 0) {
          const mapped = eData.map(enq => ({
            ...enq,
            date: enq.created_at ? enq.created_at.split('T')[0] : (enq.date || new Date().toISOString().split('T')[0])
          }));
          setEnquiries(mapped);
        }
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

  const login = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        // Local Fallback for Demo Admin Account
        if (email === 'admin@titan.com' && password === 'admin123') {
          const user = { id: 'admin-1', name: 'Admin', email, role: 'admin' };
          setAuth({ user, isAuthenticated: true, role: 'admin' });
          return { success: true, role: 'admin' };
        }
        // Local Fallback for existing seed members
        const foundMember = members.find((m) => m.email.toLowerCase() === email.toLowerCase());
        if (foundMember) {
          const user = { id: foundMember.id, name: foundMember.name, email, role: 'member' };
          setAuth({ user, isAuthenticated: true, role: 'member' });
          return { success: true, role: 'member' };
        }
        return { success: false, error: error.message };
      }
      const user = data.user;
      const role = user.email === 'admin@titan.com' || user.user_metadata?.role === 'admin' ? 'admin' : 'member';
      setAuth({
        user: {
          id: user.id,
          name: user.user_metadata?.name || user.email.split('@')[0],
          email: user.email,
          role: role
        },
        isAuthenticated: true,
        role: role
      });
      return { success: true, role };
    } catch (err) {
      // Local Fallback for Demo Admin Account
      if (email === 'admin@titan.com' && password === 'admin123') {
        const user = { id: 'admin-1', name: 'Admin', email, role: 'admin' };
        setAuth({ user, isAuthenticated: true, role: 'admin' });
        return { success: true, role: 'admin' };
      }
      // Local Fallback for existing seed members
      const foundMember = members.find((m) => m.email.toLowerCase() === email.toLowerCase());
      if (foundMember) {
        const user = { id: foundMember.id, name: foundMember.name, email, role: 'member' };
        setAuth({ user, isAuthenticated: true, role: 'member' });
        return { success: true, role: 'member' };
      }
      return { success: false, error: err.message };
    }
  }, [setAuth, members]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setAuth({ user: null, isAuthenticated: false, role: 'guest' });
    } catch (e) {
      console.error('Error signing out:', e);
    }
  }, [setAuth]);

  const register = useCallback(async (name, email, password) => {
    if (!name || !email || !password) return { success: false, error: 'All fields required' };
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'member'
          }
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      const user = data.user;
      const isSessionActive = !!data.session;
      const role = 'member';
      
      const userObj = {
        id: user.id,
        name: user.user_metadata?.name || name,
        email: user.email,
        role: role
      };

      try {
        const newMember = {
          id: user.id,
          name,
          email,
          plan: 'Basic Plan',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'active',
          user_id: user.id
        };
        await supabase.from('members').insert(newMember);
        setMembers((prev) => [...prev, newMember]);
      } catch (e) {
        console.error('Error inserting member to public table:', e);
      }

      if (isSessionActive) {
        setAuth({
          user: userObj,
          isAuthenticated: true,
          role: role
        });
      }

      return {
        success: true,
        sessionActive: isSessionActive,
        message: isSessionActive ? 'Registration successful.' : 'Registration successful! Please check your email for confirmation.'
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [setAuth, setMembers]);

  const addEnquiry = useCallback(async (enquiry) => {
    const newId = crypto.randomUUID();
    const newEnquiry = { ...enquiry, id: newId, date: new Date().toISOString().split('T')[0], status: 'new' };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const dbEnquiry = {
        id: newId,
        name: newEnquiry.name,
        email: newEnquiry.email,
        phone: newEnquiry.phone || null,
        subject: newEnquiry.subject,
        message: newEnquiry.message,
        status: newEnquiry.status,
        ...(user ? { user_id: user.id } : {})
      };
      await supabase.from('contact_enquiries').insert(dbEnquiry);
    } catch (e) {
      console.error('Error inserting enquiry to Supabase:', e);
    }
  }, [setEnquiries]);

  const updateEnquiry = useCallback(async (id, updates) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    try {
      const dbUpdates = { ...updates };
      delete dbUpdates.date;
      Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);
      await supabase.from('contact_enquiries').update(dbUpdates).eq('id', id);
    } catch (e) {
      console.error('Error updating enquiry in Supabase:', e);
    }
  }, [setEnquiries]);

  const addReview = useCallback(async (review) => {
    const newId = crypto.randomUUID();
    const isSuccess = review.type === 'success-story';
    const newReview = { ...review, id: newId };
    setReviews((prev) => [newReview, ...prev]);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const dbReview = {
        id: newId,
        name: newReview.name,
        designation: isSuccess ? `${newReview.role} | success-story` : newReview.role,
        review: newReview.quote,
        image_url: newReview.avatar,
        rating: newReview.rating,
        is_featured: newReview.featured ?? true,
        ...(user ? { user_id: user.id } : {})
      };
      await supabase.from('testimonials').insert(dbReview);
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
      const { data: { user } } = await supabase.auth.getUser();
      const dbMember = {
        ...newMember,
        ...(user ? { user_id: user.id } : {})
      };
      await supabase.from('members').insert(dbMember);
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

  const updateMember = useCallback(async (id, updates) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    try {
      const dbUpdates = {
        name: updates.name,
        email: updates.email,
        plan: updates.plan,
        joinDate: updates.joinDate,
        status: updates.status
      };
      Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);
      await supabase.from('members').update(dbUpdates).eq('id', id);
    } catch (e) {
      console.error('Error updating member in Supabase:', e);
    }
  }, [setMembers]);

  const updatePlan = useCallback(async (id, updates) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      const dbPlan = {
        name: updates.name,
        slug: updates.slug,
        description: updates.description,
        monthly_price: updates.pricing?.monthly,
        quarterly_price: updates.pricing?.quarterly,
        yearly_price: updates.pricing?.yearly,
        popular: updates.popular,
      };
      Object.keys(dbPlan).forEach(key => dbPlan[key] === undefined && delete dbPlan[key]);
      await supabase.from('membership_plans').update(dbPlan).eq('id', id);
    } catch (e) {
      console.error('Error updating plan in Supabase:', e);
    }
  }, [setPlans]);

  const addPlan = useCallback(async (plan) => {
    const newPlan = { ...plan, id: plan.id || generateId() };
    setPlans((prev) => [...prev, newPlan]);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const dbPlan = {
        id: newPlan.id,
        name: newPlan.name,
        slug: newPlan.slug,
        category: 'plans',
        description: newPlan.description,
        monthly_price: newPlan.pricing?.monthly,
        quarterly_price: newPlan.pricing?.quarterly,
        yearly_price: newPlan.pricing?.yearly,
        popular: newPlan.popular,
        ...(user ? { user_id: user.id } : {})
      };
      await supabase.from('membership_plans').insert(dbPlan);
    } catch (e) {
      console.error('Error inserting plan in Supabase:', e);
    }
  }, [setPlans]);

  const deletePlan = useCallback(async (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabase.from('membership_plans').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting plan in Supabase:', e);
    }
  }, [setPlans]);

  const updateTrainer = useCallback(async (id, updates) => {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      const dbTrainer = {
        name: updates.name,
        slug: updates.slug,
        designation: updates.specialty,
        bio: updates.bio,
        experience: updates.experience !== undefined ? (parseInt(updates.experience) || 0) : undefined,
        image_url: updates.image,
        email: updates.email,
        phone: updates.phone,
        facebook: updates.socials?.facebook,
        twitter: updates.socials?.twitter,
        instagram: updates.socials?.instagram,
      };
      Object.keys(dbTrainer).forEach(key => dbTrainer[key] === undefined && delete dbTrainer[key]);
      await supabase.from('trainers').update(dbTrainer).eq('id', id);
    } catch (e) {
      console.error('Error updating trainer in Supabase:', e);
    }
  }, [setTrainers]);

  const addTrainer = useCallback(async (trainer) => {
    const newId = crypto.randomUUID();
    const newTrainer = { ...trainer, id: newId };
    setTrainers((prev) => [...prev, newTrainer]);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const dbTrainer = {
        id: newId,
        name: newTrainer.name,
        slug: newTrainer.slug,
        designation: newTrainer.specialty,
        bio: newTrainer.bio,
        experience: parseInt(newTrainer.experience) || 0,
        image_url: newTrainer.image,
        email: newTrainer.email,
        phone: newTrainer.phone,
        facebook: newTrainer.socials?.facebook || '#',
        twitter: newTrainer.socials?.twitter || '#',
        instagram: newTrainer.socials?.instagram || '#',
        is_active: true,
        ...(user ? { user_id: user.id } : {})
      };
      await supabase.from('trainers').insert(dbTrainer);
    } catch (e) {
      console.error('Error inserting trainer in Supabase:', e);
    }
  }, [setTrainers]);

  const deleteTrainer = useCallback(async (id) => {
    setTrainers((prev) => prev.filter((t) => t.id !== id));
    try {
      await supabase.from('trainers').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting trainer in Supabase:', e);
    }
  }, [setTrainers]);

  const deleteEnquiry = useCallback(async (id) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    try {
      await supabase.from('contact_enquiries').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting enquiry in Supabase:', e);
    }
  }, [setEnquiries]);

  const updateReview = useCallback(async (id, updates) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    try {
      const isSuccess = updates.type === 'success-story' || (updates.type === undefined && reviews.find(r => r.id === id)?.type === 'success-story');
      const dbReview = {
        name: updates.name,
        designation: updates.role !== undefined ? (isSuccess ? `${updates.role} | success-story` : updates.role) : undefined,
        review: updates.quote,
        image_url: updates.avatar,
        rating: updates.rating,
        is_featured: updates.featured,
      };
      Object.keys(dbReview).forEach(key => dbReview[key] === undefined && delete dbReview[key]);
      await supabase.from('testimonials').update(dbReview).eq('id', id);
    } catch (e) {
      console.error('Error updating testimonial in Supabase:', e);
    }
  }, [setReviews]);

  const value = {
    cart, cartCount, cartTotal, addToCart, removeFromCart, updateCartQuantity, clearCart,
    wishlist, wishlistCount, addToWishlist, removeFromWishlist, isInWishlist, moveToCart,
    auth: useMemo(() => ({ ...auth, loading: authLoading }), [auth, authLoading]), login, logout, register,
    preferences, setPreferences,
    plans, updatePlan, addPlan, deletePlan,
    trainers, updateTrainer, addTrainer, deleteTrainer,
    members, addMember, deleteMember, updateMember,
    enquiries, addEnquiry, updateEnquiry, deleteEnquiry,
    reviews, addReview, deleteReview, updateReview,
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

