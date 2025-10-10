import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConsentBanner } from "@/components/ConsentBanner";
import ScenarioHelper from "./pages/ScenarioHelper";
import RulesBrowser from "./pages/RulesBrowser";
import RulesManagement from "./pages/RulesManagement";
import RuleReview from "./pages/RuleReview";
import ResponsesViewer from "./pages/ResponsesViewer";
import GuidanceViewer from "./pages/GuidanceViewer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Messages from "./pages/Messages";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConsentBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ScenarioHelper />} />
          <Route path="/review" element={<RuleReview />} />
          <Route path="/rules" element={<RulesBrowser />} />
          <Route path="/rules/manage" element={<ProtectedRoute><RulesManagement /></ProtectedRoute>} />
          <Route path="/responses" element={<ProtectedRoute><ResponsesViewer /></ProtectedRoute>} />
          <Route path="/guidance" element={<ProtectedRoute><GuidanceViewer /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
