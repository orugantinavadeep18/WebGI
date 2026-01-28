import { Link } from "react-router-dom";
import { ArrowRight, Shield, CheckCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/search/SearchBar";
import HowItWorks from "@/components/home/HowItWorks";
import PropertyTypes from "@/components/home/PropertyTypes";
import PopularCities from "@/components/home/PopularCities";
import heroImage from "@/assets/hero-hostel.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
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
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-6 animate-fade-in">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Verification-Based Trust System</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
              Find Verified Hostels & PGs You Can{" "}
              <span className="text-accent">Trust</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: "100ms" }}>
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

      {/* AI Recommendations Flow Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
          }
          .ai-title { animation: fadeInUp 0.6s ease-out; }
          .factor-card { animation: fadeInUp 0.6s ease-out both; }
          .factor-card:nth-child(1) { animation-delay: 0.1s; }
          .factor-card:nth-child(2) { animation-delay: 0.2s; }
          .factor-card:nth-child(3) { animation-delay: 0.3s; }
          .factor-card:nth-child(4) { animation-delay: 0.4s; }
          .factor-card:nth-child(5) { animation-delay: 0.5s; }
          .progress-bar { animation: slideInRight 0.8s ease-out; animation-fill-mode: both; }
          .emoji-bounce { animation: bounce 2s infinite; }
        `}</style>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Title */}
            <div className="text-center mb-12">
              <h2 className="ai-title text-4xl font-bold text-blue-900 mb-3">🤖 How Our AI Recommends Properties</h2>
              <p className="ai-title text-lg text-blue-700" style={{animationDelay: '0.2s'}}>Advanced 5-Factor Hybrid Scoring Algorithm</p>
            </div>

            {/* Scoring Factors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
              {/* Factor 1: Price */}
              <div className="factor-card bg-white rounded-xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl emoji-bounce">💰</span>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">25%</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Price Match</h3>
                <p className="text-sm text-gray-600">Matches your budget preferences & financial constraints</p>
                <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="progress-bar bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>

              {/* Factor 2: Ratings */}
              <div className="factor-card bg-white rounded-xl p-6 border-2 border-yellow-200 shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl emoji-bounce" style={{animationDelay: '0.2s'}}>⭐</span>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">30%</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Ratings & Reviews</h3>
                <p className="text-sm text-gray-600">Prioritizes highly-rated & trusted properties</p>
                <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="progress-bar bg-yellow-500 h-2 rounded-full" style={{width: '30%', animationDelay: '0.3s'}}></div>
                </div>
              </div>

              {/* Factor 3: Amenities */}
              <div className="factor-card bg-white rounded-xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl emoji-bounce" style={{animationDelay: '0.4s'}}>✨</span>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">25%</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Amenities Match</h3>
                <p className="text-sm text-gray-600">Finds properties with your desired amenities</p>
                <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="progress-bar bg-blue-500 h-2 rounded-full" style={{width: '25%', animationDelay: '0.4s'}}></div>
                </div>
              </div>

              {/* Factor 4: Vacancy */}
              <div className="factor-card bg-white rounded-xl p-6 border-2 border-purple-200 shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl emoji-bounce" style={{animationDelay: '0.6s'}}>📍</span>
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">15%</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Availability</h3>
                <p className="text-sm text-gray-600">Prioritizes properties with open vacancies</p>
                <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="progress-bar bg-purple-500 h-2 rounded-full" style={{width: '15%', animationDelay: '0.5s'}}></div>
                </div>
              </div>

              {/* Factor 5: Capacity */}
              <div className="factor-card bg-white rounded-xl p-6 border-2 border-red-200 shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl emoji-bounce" style={{animationDelay: '0.8s'}}>👥</span>
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">5%</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Capacity</h3>
                <p className="text-sm text-gray-600">Matches your occupancy needs & requirements</p>
                <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="progress-bar bg-red-500 h-2 rounded-full" style={{width: '5%', animationDelay: '0.6s'}}></div>
                </div>
              </div>
            </div>

            {/* How It Works Flow */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 mb-12 shadow-xl" style={{animation: 'fadeInUp 0.6s ease-out 0.7s both'}}>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">🔄 Recommendation Process Flow</h3>
              <div className="flex items-center justify-between flex-wrap gap-6">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{animation: 'fadeInUp 0.6s ease-out 0.8s both'}}>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 font-bold text-4xl text-blue-700 shadow-md hover:shadow-lg transform transition hover:scale-110">1️⃣</div>
                  <p className="text-base font-bold text-gray-900">Your Filters</p>
                  <p className="text-xs text-gray-600 mt-2">Budget, city, amenities</p>
                </div>

                {/* Arrow */}
                <div className="text-4xl text-blue-400 hidden md:block mb-8 animate-pulse">→</div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{animation: 'fadeInUp 0.6s ease-out 0.9s both'}}>
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mb-4 font-bold text-4xl text-indigo-700 shadow-md hover:shadow-lg transform transition hover:scale-110">2️⃣</div>
                  <p className="text-base font-bold text-gray-900">AI Analysis</p>
                  <p className="text-xs text-gray-600 mt-2">5-factor algorithm</p>
                </div>

                {/* Arrow */}
                <div className="text-4xl text-blue-400 hidden md:block mb-8 animate-pulse">→</div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{animation: 'fadeInUp 0.6s ease-out 1.0s both'}}>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-4 font-bold text-4xl text-purple-700 shadow-md hover:shadow-lg transform transition hover:scale-110">3️⃣</div>
                  <p className="text-base font-bold text-gray-900">Scoring</p>
                  <p className="text-xs text-gray-600 mt-2">Calculates 0-100</p>
                </div>

                {/* Arrow */}
                <div className="text-4xl text-blue-400 hidden md:block mb-8 animate-pulse">→</div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{animation: 'fadeInUp 0.6s ease-out 1.1s both'}}>
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mb-4 font-bold text-4xl text-pink-700 shadow-md hover:shadow-lg transform transition hover:scale-110">4️⃣</div>
                  <p className="text-base font-bold text-gray-900">Ranking</p>
                  <p className="text-xs text-gray-600 mt-2">Top matches first</p>
                </div>

                {/* Arrow */}
                <div className="text-4xl text-blue-400 hidden md:block mb-8 animate-pulse">→</div>

                {/* Step 5 */}
                <div className="flex flex-col items-center text-center flex-1 min-w-[120px]" style={{animation: 'fadeInUp 0.6s ease-out 1.2s both'}}>
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mb-4 font-bold text-4xl text-teal-700 shadow-md hover:shadow-lg transform transition hover:scale-110">5️⃣</div>
                  <p className="text-base font-bold text-gray-900">Results</p>
                  <p className="text-xs text-gray-600 mt-2">Best properties shown</p>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{animation: 'fadeInUp 0.6s ease-out 1.3s both'}}>
              <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300" style={{animation: 'fadeInUp 0.6s ease-out 1.4s both'}}>
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-3">
                  <span className="text-3xl">✅</span> Smart Learning
                </h4>
                <p className="text-gray-600">AI learns from your search history & preferences over time for better recommendations</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500 shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300" style={{animation: 'fadeInUp 0.6s ease-out 1.5s both'}}>
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-3">
                  <span className="text-3xl">⚡</span> Real-Time Updates
                </h4>
                <p className="text-gray-600">Recommendations update instantly when you adjust filters and preferences</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300" style={{animation: 'fadeInUp 0.6s ease-out 1.6s both'}}>
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-3">
                  <span className="text-3xl">🎯</span> Personalized
                </h4>
                <p className="text-gray-600">Every recommendation is tailored to YOUR specific needs and budget</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12" style={{animation: 'fadeInUp 0.6s ease-out 1.7s both'}}>
              <Link to="/properties">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 transform transition hover:scale-110">
                  Try AI Recommendations Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Popular Cities */}
      <PopularCities />

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
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
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
