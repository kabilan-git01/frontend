import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

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

import AdminDashboard from './pages/admin/Dashboard';
import AdminPlans from './pages/admin/AdminPlans';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminMembers from './pages/admin/AdminMembers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminEnquiries from './pages/admin/AdminEnquiries';

export default function App() {
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
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="search" element={<Search />} />
        <Route path="bmi-calculator" element={<BMICalculator />} />
        <Route path="contact" element={<Contact />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
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
