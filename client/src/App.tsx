import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Import pages
import Home from "@/pages/Home";
import Listings from "@/pages/Listings";
import GuidelinesAndFAQ from "@/pages/GuidelinesAndFAQ";
import About from "@/pages/About";
import Map from "@/pages/Map";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";

// Import components
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/listings" component={Listings} />
      <Route path="/resources" component={GuidelinesAndFAQ} />
      <Route path="/about" component={About} />
      <Route path="/map" component={Map} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [scrollY, setScrollY] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <FavoritesProvider userId={user?.id ?? ''}>
      <div className="min-h-screen flex flex-col">
        <NavBar scrollY={scrollY} />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </FavoritesProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
