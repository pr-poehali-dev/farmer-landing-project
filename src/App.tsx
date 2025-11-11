import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@/i18n/config';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerDashboardNew from "./pages/FarmerDashboardNew";
import InvestorDashboard from "./pages/InvestorDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserDelete from "./pages/AdminUserDelete";
import AdminMetrics from "./pages/AdminMetrics";
import AdminRecalculate from "./pages/AdminRecalculate";
import AdminRecalculateRatings from "./pages/AdminRecalculateRatings";
import AdminCleanup from "./pages/AdminCleanup";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contacts from "./pages/Contacts";
import TestAccounts from "./pages/TestAccounts";
import NotFound from "./pages/NotFound";
import Leaderboard from "./pages/Leaderboard";
import B2BPanel from "./pages/B2BPanel";
import OAuthCallback from "./pages/OAuthCallback";
import TelegramAuth from "./pages/TelegramAuth";
import FarmerProfile from "./pages/FarmerProfile";
import AIAnalytics from "./components/farmer/AIAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/farmer" element={<FarmerDashboardNew />} />
          <Route path="/dashboard/farmer/old" element={<FarmerDashboard />} />
          <Route path="/dashboard/farmer/ai-analytics" element={<AIAnalytics />} />
          <Route path="/dashboard/investor" element={<InvestorDashboard />} />
          <Route path="/dashboard/seller" element={<SellerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/metrics" element={<AdminMetrics />} />
          <Route path="/admin/delete-users" element={<AdminUserDelete />} />
          <Route path="/admin/recalculate" element={<AdminRecalculate />} />
          <Route path="/admin/recalculate-ratings" element={<AdminRecalculateRatings />} />
          <Route path="/admin/cleanup" element={<AdminCleanup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/test" element={<TestAccounts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/b2b" element={<B2BPanel />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/oauth/telegram" element={<TelegramAuth />} />
          <Route path="/farmer/:farmerId" element={<FarmerProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;