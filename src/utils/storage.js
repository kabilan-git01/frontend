export const STORAGE_KEYS = {
  CART: 'titan_cart',
  WISHLIST: 'titan_wishlist',
  AUTH: 'titan_auth',
  PREFERENCES: 'titan_preferences',
  MEMBERS: 'titan_members',
  ENQUIRIES: 'titan_enquiries',
  REVIEWS: 'titan_reviews',
  PLANS: 'titan_plans',
  TRAINERS: 'titan_trainers',
};

export function getStorageItem(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key}:`, error);
  }
}
