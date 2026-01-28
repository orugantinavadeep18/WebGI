import { Link } from "react-router-dom";
import { Building, Home, Users, Key, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { apiCall } from "@/lib/api";

const PropertyTypes = () => {
  const [stats, setStats] = useState({
    hostel: 0,
    pg: 0,
    others: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiCall("/rentals");
        const properties = data.rentals || [];

        // Count properties by type
        const counts = {
          hostel: 0,
          pg: 0,
          others: 0,
        };

        properties.forEach((prop) => {
          const type = prop.property_type?.toLowerCase() || "others";
          if (type in counts) {
            counts[type]++;
          }
        });

        setStats(counts);
      } catch (error) {
        console.error("Error fetching property stats:", error);
        // Keep default counts on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const types = [
    {
      icon: Building,
      title: "Hostels",
      description: "Affordable shared accommodations with community living",
      count: `${stats.hostel}+ listings`,
      href: "/properties?type=hostel",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Users,
      title: "Paying Guest (PG)",
      description: "Home-like stay with meals and housekeeping",
      count: `${stats.pg}+ listings`,
      href: "/properties?type=pg",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Key,
      title: "Other Properties",
      description: "Rental rooms and various accommodation types",
      count: `${stats.others}+ listings`,
      href: "/properties?type=others",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Your Perfect Stay
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose from verified hostels, PGs, and other properties across major cities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type) => (
            <Link
              key={type.title}
              to={type.href}
              className="group bg-card rounded-xl p-6 border hover:border-accent/50 hover:shadow-lg transition-all"
            >
              <div className={`h-14 w-14 rounded-xl ${type.color} flex items-center justify-center mb-4`}>
                <type.icon className="h-7 w-7" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                {type.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {type.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{loading ? "Loading..." : type.count}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
