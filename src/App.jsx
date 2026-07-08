import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Trainers from './pages/Trainers';
import TrainerDetail from './pages/TrainerDetail';
import MembershipPlans from './pages/MembershipPlans';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Search from './pages/Search';
import BMICalculator from './pages/BMICalculator';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminPlans from './pages/admin/AdminPlans';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminMembers from './pages/admin/AdminMembers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminEnquiries from './pages/admin/AdminEnquiries';

import supabase from './supabaseClient.js';

export default function App() {
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      console.log('Data:', data);
      console.log('Error:', error);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const testBackendConnection = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        console.error("❌ Backend Connection Failed");
        console.error("Exact Error: VITE_API_URL is undefined or empty in environment variables.");
        console.group("🔍 Backend Connection Diagnostic Guide");
        console.warn("Suggestion: Create or update your .env file in the React project root and add 'VITE_API_URL=https://backend-1-h6k5.onrender.com'. Make sure you prefix Vite environment variables with VITE_.");
        console.groupEnd();
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/test`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("✅ Backend Connected Successfully");
        console.log("Backend Response:", data);
      } catch (error) {
        console.error("❌ Backend Connection Failed");
        console.error("Exact Error:", error);

        console.group("🔍 Backend Connection Diagnostic Guide");
        
        if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
          console.warn(`Suggestion: VITE_API_URL (${apiUrl}) does not start with http:// or https://. Ensure the URL scheme is correct.`);
        }

        console.warn("Possible Issue 1 [CORS Policy]: Ensure the backend has CORS enabled. Install the 'cors' package and add 'app.use(cors())' in server.js.");
        console.warn(`Possible Issue 2 [Render Sleeping]: Render free instances spin down after 15 minutes of inactivity. The server might be booting up. Visit the deployed link directly in your browser to wake it up: ${apiUrl}`);
        console.warn("Possible Issue 3 [Incorrect API URL]: Check if the URL matches the active Render deployment (e.g. no trailing slash errors or typos).");
        console.warn("Possible Issue 4 [Fetch/Network error]: Check if you are offline, or if your browser's security/adblocker settings are blocking request origins.");
        
        console.groupEnd();
      }
    };
    testBackendConnection();
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="programs" element={<Programs />} />
        <Route path="programs/:slug" element={<ProgramDetail />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="trainers/:slug" element={<TrainerDetail />} />
        <Route path="membership" element={<MembershipPlans />} />
        <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="search" element={<Search />} />
        <Route path="bmi-calculator" element={<BMICalculator />} />
        <Route path="contact" element={<Contact />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route path="trainers" element={<AdminTrainers />} />
        <Route path="members" element={<AdminMembers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
      </Route>
    </Routes>
  );
}
