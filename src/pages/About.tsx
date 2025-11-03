import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Globe, Shield, Award, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-sunset bg-clip-text text-transparent">
            About HomestayHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting travelers with authentic local experiences since 2024. 
            We believe in the power of cultural exchange and meaningful connections.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <Card className="border-primary/20 shadow-travel">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <Heart className="w-8 h-8 text-primary mt-1" />
                <div>
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    HomestayHub was created to bridge the gap between travelers seeking authentic 
                    experiences and hosts eager to share their culture and homes. We believe that 
                    the best way to understand a place is through the eyes of locals, and that 
                    travel should create meaningful connections that last a lifetime.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Values Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-travel transition-smooth">
              <CardContent className="p-6">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Community First</h3>
                <p className="text-muted-foreground">
                  Building strong relationships between hosts and guests to create a global 
                  community of travel enthusiasts.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-travel transition-smooth">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Trust & Safety</h3>
                <p className="text-muted-foreground">
                  Verified hosts, secure payments, and 24/7 support ensure a safe experience 
                  for everyone in our community.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-travel transition-smooth">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Cultural Exchange</h3>
                <p className="text-muted-foreground">
                  Promoting understanding and appreciation of diverse cultures through 
                  immersive travel experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <Card className="bg-gradient-sunset text-white">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold mb-2">10K+</div>
                  <div className="text-white/90">Active Homestays</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">50K+</div>
                  <div className="text-white/90">Happy Travelers</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">150+</div>
                  <div className="text-white/90">Countries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose HomestayHub?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-travel transition-smooth">
              <CardContent className="p-6">
                <Award className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Verified Quality</h3>
                <p className="text-muted-foreground">
                  Every homestay is personally reviewed and verified by our team to ensure it 
                  meets our high standards for comfort, cleanliness, and hospitality.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-travel transition-smooth">
              <CardContent className="p-6">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Unique Experiences</h3>
                <p className="text-muted-foreground">
                  From cooking traditional meals to exploring hidden gems, our hosts offer 
                  experiences you won't find in any guidebook.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <Card className="border-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Whether you're a traveler seeking authentic experiences or a host wanting to share 
                your home and culture, HomestayHub is here to make meaningful connections happen.
              </p>
              <p className="text-muted-foreground">
                Have questions? Feel free to reach out to our support team anytime.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default About;