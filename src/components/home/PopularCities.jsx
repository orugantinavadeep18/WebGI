import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { apiCall } from "@/lib/api";

const PopularCities = () => {
  const [cities, setCities] = useState([
    { name: "Bangalore", properties: 0, image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop" },
    { name: "Mumbai", properties: 0, image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop" },
    { name: "Delhi", properties: 0, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop" },
    { name: "Pune", properties: 0, image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=400&h=300&fit=crop" },
    { name: "Hyderabad", properties: 0, image: "https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=300&fit=crop" },
    { name: "Chennai", properties: 0, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const data = await apiCall("/rentals");
        const properties = data.rentals || [];

        // Count properties by city
        const cityCounts = {};
        properties.forEach((prop) => {
          const city = prop.city || "Unknown";
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        });

        // Update cities with real counts
        const updatedCities = cities.map((city) => ({
          ...city,
          properties: cityCounts[city.name] || 0,
        }));

        setCities(updatedCities);
      } catch (error) {
        console.error("Error fetching city data:", error);
        // Keep default cities on error
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, []);

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
              Popular Cities
            </h2>
            <p className="text-muted-foreground">
              Explore verified properties in top Indian cities
            </p>
          </div>
          <Link
            to="/properties"
            className="hidden md:flex items-center gap-2 text-accent font-medium hover:underline"
          >
            View all cities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
            <Link
              key={city.name}
              to={`/properties?city=${city.name}`}
              className="group relative overflow-hidden rounded-xl aspect-[4/5] block"
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1 text-primary-foreground/80 text-xs mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{loading ? "Loading..." : `${city.properties}+ properties`}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary-foreground">
                  {city.name}
                </h3>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>

        <Link
          to="/properties"
          className="md:hidden flex items-center justify-center gap-2 text-accent font-medium mt-6"
        >
          View all cities
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default PopularCities;
