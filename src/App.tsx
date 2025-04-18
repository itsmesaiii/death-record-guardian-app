// src/App.tsx

import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DeathRecordForm from "./pages/DeathRecordForm";
import SubmissionHistory from "./pages/SubmissionHistory";
import SubmissionConfirmation from "./pages/SubmissionConfirmation";
import NotFound from "./pages/NotFound";

import accounts from "./data/accounts"; // still seed these for LoginForm

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Seed the VAO accounts into localStorage on first load
    if (!localStorage.getItem("vao_accounts")) {
      localStorage.setItem("vao_accounts", JSON.stringify(accounts));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/death-record" element={<DeathRecordForm />} />
            <Route path="/submission-history" element={<SubmissionHistory />} />
            <Route path="/submission-confirmation" element={<SubmissionConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
