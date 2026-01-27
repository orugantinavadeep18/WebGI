import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Home, Search, Heart, LogIn, Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCityBar, setShowCityBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const cities = [
    "Bangalore",
    "Chennai",
    "Delhi",
    "Gurgaon",
    "Hyderabad",
    "Kolkata",
    "Mumbai",
    "Noida",
    "Pune",
    "All Cities"
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show at top of page
        setShowCityBar(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide city bar
        setShowCityBar(false);
      } else {
        // Scrolling up - show city bar
        setShowCityBar(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Main Header - Always Visible */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <nav className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-primary">
                WebGI
              </span>
            </Link>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/properties")}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>

              {user && (
                <Button
                  size="sm"
                  onClick={() => navigate("/my-properties")}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                  List Your Property
                </Button>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/my-properties")}>
                      <Home className="mr-2 h-4 w-4" />
                      My Properties
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/saved")}>
                      <Heart className="mr-2 h-4 w-4" />
                      Saved Properties
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/bookings")}>
                      <Home className="mr-2 h-4 w-4" />
                      My Bookings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden py-4 border-t"
              >
                <div className="flex flex-col gap-4">
                  {/* Cities in mobile menu */}
                  <div className="pb-4 border-b">
                    <p className="text-xs font-semibold text-muted-foreground mb-3 px-2">CITIES</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.map((city) => (
                        <Button
                          key={city}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigate(`/properties?city=${city.toLowerCase()}`);
                            setMobileMenuOpen(false);
                          }}
                          className="justify-start text-sm"
                        >
                          {city}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {user ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigate("/saved");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Saved Properties
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Log out
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        onClick={() => {
                          navigate("/auth");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* City Navigation Bar - Slides up under main navbar */}
      <motion.div
        initial={{ y: 64 }}
        animate={{ y: showCityBar ? 64 : 16 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 h-12 overflow-x-auto scrollbar-hide">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/properties?city=${city.toLowerCase()}`)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap group"
              >
                {city}
                {city !== "All Cities" && (
                  <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Header;