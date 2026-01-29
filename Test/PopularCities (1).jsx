import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const popularCities = [
  { name: "Bangalore", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop" },
  { name: "Mumbai", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop" },
  { name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop" },
  { name: "Pune", image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=400&h=300&fit=crop" },
  { name: "Hyderabad", image: "https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=300&fit=crop" },
  { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop" },
];

const PopularCities = () => {
  const [cityCounts, setCityCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityCounts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/rentals/city-counts`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ City counts from API:", data);
          
          // Create a case-insensitive map
          const countsMap = {};
          data.forEach(item => {
            if (item.city && item.city.trim()) {
              const normalizedCity = item.city.toLowerCase().trim();
              countsMap[normalizedCity] = item.count;
            }
          });
          
          console.log("✅ Processed counts map:", countsMap);
          setCityCounts(countsMap);
        } else {
          console.error("❌ API response not OK:", response.status);
        }
      } catch (error) {
        console.error("❌ Error fetching city counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCityCounts();
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
          {popularCities.map((city, index) => {
            // Normalize city name for lookup
            const normalizedCityName = city.name.toLowerCase().trim();
            const propertyCount = cityCounts[normalizedCityName] || 0;
            
            console.log(`🔍 Checking ${city.name} (${normalizedCityName}): ${propertyCount} properties`);
            
            return (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={`/properties?city=${city.name.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-xl aspect-[4/5] block"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {!loading && (
                      <div className="flex items-center gap-1 text-primary-foreground/80 text-xs mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {propertyCount > 0 
                            ? `${propertyCount} ${propertyCount === 1 ? 'property' : 'properties'}`
                            : 'No properties yet'
                          }
                        </span>
                      </div>
                    )}
                    <h3 className="font-heading font-semibold text-lg text-primary-foreground">
                      {city.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
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
