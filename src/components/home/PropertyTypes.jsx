import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { apiCall } from "@/lib/api";
import { motion } from "framer-motion";

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
      title: "Hostels",
      description: "Affordable shared accommodations with community living",
      count: `${stats.hostel}+ listings`,
      href: "/properties?type=hostel",
      image: "/hostel.webp",
    },
    {
      title: "Paying Guest (PG)",
      description: "Home-like stay with meals and housekeeping",
      count: `${stats.pg}+ listings`,
      href: "/properties?type=pg",
      image: "/PG.jpg",
    },
    {
      title: "Other Properties",
      description: "Rental rooms and various accommodation types",
      count: `${stats.others}+ listings`,
      href: "/properties?type=others",
      image: "/Rental.jpg",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Find Your Perfect Stay
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Choose from verified hostels, PGs, and other properties across major cities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {types.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={type.href}
                className="group relative overflow-hidden rounded-2xl h-96 block hover:shadow-2xl transition-all duration-300"
              >
                {/* Background Image */}
                <img
                  src={type.image}
                  alt={type.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay Gradient - Enhanced */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-800/40 to-slate-800/10 group-hover:from-slate-900/90 group-hover:via-slate-800/50 transition-all duration-300"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                  <div className="space-y-3">
                    <h3 className="font-heading font-bold text-3xl md:text-2xl leading-tight group-hover:translate-x-2 transition-transform duration-300">
                      {type.title}
                    </h3>
                    <p className="text-white/85 text-base leading-relaxed max-w-xs">
                      {type.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <span className="text-base font-semibold text-white/95">
                      {loading ? "Loading..." : type.count}
                    </span>
                    <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
