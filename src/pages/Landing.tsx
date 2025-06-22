
import { useState } from 'react';
import { MapPin, Heart, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: MapPin,
      title: "Discover Hidden Gems",
      description: "Find amazing local spots that match your vibe"
    },
    {
      icon: Heart,
      title: "Save Your Favorites",
      description: "Create your personal bucket list of places to visit"
    },
    {
      icon: Users,
      title: "Share with Community",
      description: "Add your own favorite spots for others to discover"
    }
  ];

  return (
    <div className="min-h-screen bg-tambii-gray relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-tambii-dark/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-tambii-dark flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-tambii-dark tracking-tight">Tambii</h1>
        </div>
        
        <Button
          onClick={() => navigate('/auth')}
          variant="outline"
          className="rounded-2xl border-tambii-dark text-tambii-dark hover:bg-tambii-dark hover:text-white"
        >
          Sign In
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-tambii-dark flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-tambii-dark mb-6 tracking-tight">
            Find Your Next
            <br />
            <span className="text-tambii-dark/70">Tambayan</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover amazing local spots, save your favorites, and share hidden gems with a community of explorers just like you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-tambii-dark hover:bg-tambii-dark/90 rounded-2xl px-8 py-4 text-lg"
            >
              Get Started
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              size="lg"
              className="rounded-2xl px-8 py-4 text-lg border-tambii-dark text-tambii-dark hover:bg-tambii-dark hover:text-white"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`modern-card border-0 shadow-lg rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer ${
                hoveredFeature === index ? 'transform scale-105 shadow-xl' : ''
              }`}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                hoveredFeature === index ? 'bg-tambii-dark' : 'bg-gray-100'
              }`}>
                <feature.icon className={`w-8 h-8 transition-colors duration-300 ${
                  hoveredFeature === index ? 'text-white' : 'text-tambii-dark'
                }`} />
              </div>
              <h3 className="text-xl font-bold text-tambii-dark mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="modern-card border-0 shadow-xl rounded-3xl p-12 bg-gradient-to-r from-tambii-dark to-tambii-dark/90">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Exploring?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join our community and start discovering amazing places around you.
            </p>
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              variant="outline"
              className="bg-white text-tambii-dark hover:bg-gray-100 rounded-2xl px-8 py-4 text-lg border-white"
            >
              Sign Up Now
            </Button>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 mt-16 border-t border-gray-200">
        <p className="text-gray-500">
          © 2024 Tambii. Discover your next favorite spot.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
