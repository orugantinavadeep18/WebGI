import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Home className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-heading text-xl font-bold">WebGI</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Find verified hostels, PGs, and rental rooms with our unique trust verification system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties?type=hostel" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Hostels
                </Link>
              </li>
              <li>
                <Link to="/properties?type=pg" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  PGs
                </Link>
              </li>
              <li>
                <Link to="/properties?type=rental_room" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Rental Rooms
                </Link>
              </li>
              <li>
                <Link to="/properties?type=flat" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Flats
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Trust & Safety</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  How Verification Works
                </Link>
              </li>
              <li>
                <Link to="/safety-guidelines" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="/trust-score" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Trust Score Explained
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                support@webgi.com
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5" />
                Bangalore, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>© 2026 WebGI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
