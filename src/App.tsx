
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

import { AuthProvider } from "@/context/AuthContext";
import AuthRoute from "@/components/auth/AuthRoute";
import GuestRoute from "@/components/auth/GuestRoute";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Accounts from "./pages/Accounts";
import Bills from "./pages/Bills";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const queryClient = new QueryClient();

const AppContent = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    
    {/* Auth Routes */}
    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
    <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
    <Route path="/reset-password" element={<ResetPassword />} />
    
    {/* Protected Routes */}
    <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
    <Route path="/transactions" element={<AuthRoute><Transactions /></AuthRoute>} />
    <Route path="/categories" element={<AuthRoute><Categories /></AuthRoute>} />
    <Route path="/accounts" element={<AuthRoute><Accounts /></AuthRoute>} />
    <Route path="/bills" element={<AuthRoute><Bills /></AuthRoute>} />
    <Route path="/reports" element={<AuthRoute><Reports /></AuthRoute>} />
    <Route path="/settings" element={<AuthRoute><Settings /></AuthRoute>} />
    
    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
