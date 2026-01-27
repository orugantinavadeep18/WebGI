import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Home, Search, Heart, LogIn, Moon, Sun, Plus } from "lucide-react";
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
import { useTheme } from "@/hooks/useTheme";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { name: "Hostels", href: "/properties?type=hostel", icon: Home },
    { name: "PGs", href: "/properties?type=pg", icon: Home },
    { name: "Rentals", href: "/properties?type=rental_room", icon: Home },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

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

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="gap-2"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

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
                  <DropdownMenuItem onClick={() => navigate("/booking-requests")}>
                    <Home className="mr-2 h-4 w-4" />
                    Booking Requests
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/messages")}>
                    <Home className="mr-2 h-4 w-4" />
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/saved")}>
                    <Heart className="mr-2 h-4 w-4" />
                    Saved Properties
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
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t flex flex-col gap-2">
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="justify-start gap-2"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-4 w-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      Dark Mode
                    </>
                  )}
                </Button>
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
  );
};

export default Header;
