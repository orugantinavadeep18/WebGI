import { Link } from "react-router-dom";
import { ArrowRight, Shield, CheckCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/search/SearchBar";
import PropertyTypes from "@/components/home/PropertyTypes";
import PopularCities from "@/components/home/PopularCities";
import heroImage from "@/assets/hero-hostel.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[500px] sm:min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Students in a hostel common area"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-2 sm:px-4 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/20 text-accent-foreground mb-4 sm:mb-6 animate-fade-in text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium">Verification-Based Trust System</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-3 sm:mb-6 animate-slide-up leading-tight">
              Find Verified Hostels & PGs You Can{" "}
              <span className="text-accent">Trust</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-6 sm:mb-8 max-w-2xl animate-slide-up leading-relaxed" style={{ animationDelay: "100ms" }}>
              No fake reviews. No false promises. Our unique verification system ensures every property is thoroughly checked before you book.
            </p>

            {/* Search Bar */}
            <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <SearchBar />
            </div>

            {/* Stats */}

          </div>
        </div>
      </section>

      {/* Property Types */}
      <PropertyTypes />
  {/* Popular Cities */}
      <PopularCities />

      {/* AI Recommendations Section - Modern Design */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-20">
              <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-xs sm:text-sm font-semibold text-primary">✨ AI-Powered Matching</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent leading-tight">
                Smart Property Discovery
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                Our intelligent algorithm learns your preferences and recommends properties that match your lifestyle, budget, and needs perfectly.
              </p>
            </div>

            {/* Scoring Factors Grid - Enhanced - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-12 sm:mb-20">
              {/* Factor 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-100 group-hover:border-transparent transition h-full flex flex-col">
                  <div className="mb-3 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 group-hover:scale-110 transition">
                      <span className="text-2xl sm:text-4xl">💰</span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Budget Match (25%)</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Properties that fit perfectly within your financial constraints</p>
                </div>
              </div>

              {/* Factor 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-100 group-hover:border-transparent transition h-full flex flex-col">
                  <div className="mb-3 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 group-hover:scale-110 transition">
                      <span className="text-2xl sm:text-4xl">⭐</span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Quality & Trust (30%)</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Verified properties with excellent ratings and reviews</p>
                </div>
              </div>

              {/* Factor 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-100 group-hover:border-transparent transition h-full flex flex-col">
                  <div className="mb-3 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-100 to-blue-50 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 group-hover:scale-110 transition">
                      <span className="text-2xl sm:text-4xl">✨</span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Amenities (25%)</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">All the facilities and services you're looking for</p>
                </div>
              </div>

              {/* Factor 4 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-100 group-hover:border-transparent transition h-full flex flex-col">
                  <div className="mb-3 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 group-hover:scale-110 transition">
                      <span className="text-2xl sm:text-4xl">📍</span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Availability (15%)</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Properties with current vacancies ready now</p>
                </div>
              </div>

              {/* Factor 5 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-100 group-hover:border-transparent transition h-full flex flex-col">
                  <div className="mb-3 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-pink-50 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 group-hover:scale-110 transition">
                      <span className="text-2xl sm:text-4xl">👥</span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Capacity (5%)</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Right-sized for your occupancy needs</p>
                </div>
              </div>
            </div>

            {/* Key Benefits - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 transition">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl mb-4">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Smart Learning</h4>
                  <p className="text-gray-600">Gets smarter with every search you make</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 transition">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-4">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Real-Time Magic</h4>
                  <p className="text-gray-600">Instant updates as you adjust filters</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 transition">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl mb-4">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Personalized</h4>
                  <p className="text-gray-600">Unique recommendations for you only</p>
                </div>
              </div>
            </div>

            {/* CTA - Enhanced */}
            <div className="text-center">
              <Link to="/properties">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-6 text-lg font-semibold rounded-xl gap-3 shadow-lg hover:shadow-xl transition">
                  Discover Your Perfect Property
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Find Your Perfect Stay?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of students who found verified accommodations through WebGI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  Browse Properties
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg"  className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
