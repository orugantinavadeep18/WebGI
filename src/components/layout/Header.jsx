import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Home, Search, Heart, LogIn, Plus, ChevronDown, Mail, Bell } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCityBar, setShowCityBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
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

  // Fetch unread message count
  useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/messages/unread/count`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setUnreadCount(data.count || 0);
          }
        } catch (err) {
          console.error("Failed to fetch unread count:", err);
        }
      };

      fetchUnreadCount();

      // Poll for new messages every 10 seconds
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
        {/* Notification Dot */}
        {unreadCount > 0 && user && (
          <div className="h-1 w-full bg-red-500 animate-pulse"></div>
        )}
        <nav className="container mx-auto px-2 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
            {/* Logo - Responsive Size */}
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <div className="relative">
                <svg className="w-24 h-12 sm:w-36 sm:h-16" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="logoShadow">
                      <feDropShadow dx="3" dy="3" stdDeviation="3" floodOpacity="0.25"/>
                    </filter>
                  </defs>
                  
                  {/* Main elegant script text with outline */}
                  <text 
                    x="15" 
                    y="50" 
                    fontSize="48" 
                    fontWeight="bold" 
                    fontFamily="cursive"
                    stroke="#1e3a8a"
                    strokeWidth="2.5"
                    fill="none"
                    style={{letterSpacing: "0px", fontStyle: "italic"}}
                    filter="url(#logoShadow)"
                  >
                    WebGI
                  </text>
                  
                  {/* Main filled text */}
                  <text 
                    x="15" 
                    y="50" 
                    fontSize="48" 
                    fontWeight="bold" 
                    fontFamily="cursive"
                    fill="#1e3a8a"
                    stroke="#1e1f36"
                    strokeWidth="0.5"
                    style={{letterSpacing: "0px", fontStyle: "italic"}}
                  >
                    WebGI
                  </text>
                  
                  {/* Decorative flourish lines below */}
                  <path d="M 15 58 Q 40 70 90 66 Q 140 62 165 68" stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"/>
                  <path d="M 25 62 Q 35 68 50 66 Q 65 65 80 68 Q 100 70 120 67 Q 140 65 155 70" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                  
                  {/* Small decorative dots */}
                  <circle cx="45" cy="72" r="1.5" fill="#1e3a8a" opacity="0.6"/>
                  <circle cx="95" cy="73" r="1.5" fill="#1e3a8a" opacity="0.6"/>
                  <circle cx="140" cy="72" r="1.5" fill="#1e3a8a" opacity="0.6"/>
                </svg>
              </div>
            </Link>

            {/* Desktop Actions - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-4">
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/properties")}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button> */}

              {user && (
                <Button
                  size="sm"
                  onClick={() => navigate("/my-properties")}
                  className="gap-1 lg:gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs lg:text-sm px-2 lg:px-4"
                >
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">List Property</span>
                </Button>
              )}

              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/messages")}
                  className="gap-1 lg:gap-2 relative text-xs lg:text-sm px-2 lg:px-4"
                >
                  <Mail className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden md:inline">Messages</span>
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-4">
                      <User className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="hidden lg:inline max-w-[60px] truncate">{user.name || 'Account'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/messages")}>
                      <Mail className="mr-2 h-4 w-4" />
                      Messages {unreadCount > 0 && `(${unreadCount})`}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
                    <DropdownMenuItem onClick={() => navigate("/booking-requests")}>
                      <Home className="mr-2 h-4 w-4" />
                      Booking Requests
                    </DropdownMenuItem>
                    {user?.email === "kittu8441@gmail.com" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/admin")} className="text-primary font-semibold">
                          ⚙️ Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
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
                  className="gap-1 lg:gap-2 bg-accent hover:bg-accent/90 text-accent-foreground text-xs lg:text-sm px-2 lg:px-4"
                >
                  <LogIn className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden p-1.5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation - Full width */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="sm:hidden py-3 border-t max-h-[60vh] overflow-y-auto"
              >
                <div className="flex flex-col gap-3 px-2">
                  {/* Cities in mobile menu - Grid Layout */}
                  <div className="pb-3 border-b">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">CITIES</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.map((city) => (
                        <Button
                          key={city}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (city !== "All Cities") {
                              trackCityClick(city);
                            }
                            navigate(`/properties?city=${city.toLowerCase()}`);
                            setMobileMenuOpen(false);
                          }}
                          className="justify-start text-xs h-8"
                        >
                          {city}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* User-specific actions */}
                  {user && (
                    <div className="pb-3 border-b space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate("/messages");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start text-xs h-8 gap-2"
                      >
                        <Mail className="h-3 w-3" />
                        Messages {unreadCount > 0 && `(${unreadCount})`}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate("/my-properties");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start text-xs h-8 gap-2"
                      >
                        <Home className="h-3 w-3" />
                        My Properties
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate("/saved");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start text-xs h-8 gap-2"
                      >
                        <Heart className="h-3 w-3" />
                        Saved Properties
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate("/bookings");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start text-xs h-8 gap-2"
                      >
                        <Home className="h-3 w-3" />
                        My Bookings
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate("/booking-requests");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start text-xs h-8 gap-2"
                      >
                        <Home className="h-3 w-3" />
                        Booking Requests
                      </Button>
                      {user?.email === "kittu8441@gmail.com" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate("/admin");
                            setMobileMenuOpen(false);
                          }}
                          className="w-full justify-start text-xs h-8 gap-2 text-primary font-semibold"
                        >
                          ⚙️ Admin Dashboard
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Auth buttons */}
                  <div className="flex flex-col gap-2">
                    {user ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-xs h-8"
                      >
                        Log out
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-8"
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

      {/* City Navigation Bar - Hidden on small mobile, visible on sm+ screens */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showCityBar ? 0 : -48 }}
        transition={{ duration: 0.3 }}
        className="hidden sm:block fixed top-14 sm:top-16 left-0 right-0 z-40 bg-background border-b border-border"
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-start gap-2 sm:gap-6 h-10 sm:h-12 overflow-x-auto scrollbar-hide">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  // Track city click
                  if (city !== "All Cities") {
                    trackCityClick(city);
                  }
                  
                  if (city === "All Cities") {
                    navigate("/properties");
                  } else {
                    navigate(`/properties?city=${city.toLowerCase()}`);
                  }
                }}
                className="flex items-center gap-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap group"
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

// Track city click helper function
const trackCityClick = async (city) => {
  try {
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/rentals/track-city-click`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city }),
      }
    );
  } catch (error) {
    console.error("Error tracking city click:", error);
  }
};

export default Header;