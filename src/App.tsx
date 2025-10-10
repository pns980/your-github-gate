import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScenarioHelper from "./pages/ScenarioHelper";
import RulesBrowser from "./pages/RulesBrowser";
import RulesManagement from "./pages/RulesManagement";
import RuleReview from "./pages/RuleReview";
import ResponsesViewer from "./pages/ResponsesViewer";
import GuidanceViewer from "./pages/GuidanceViewer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ScenarioHelper />} />
          <Route path="/review" element={<RuleReview />} />
          <Route path="/rules" element={<RulesBrowser />} />
          <Route path="/rules/manage" element={<RulesManagement />} />
          <Route path="/responses" element={<ResponsesViewer />} />
          <Route path="/guidance" element={<GuidanceViewer />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
