import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Home, User, Menu, Heart, LogOut } from "lucide-react";
import { toast } from "sonner";

const NavigationHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-travel">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-sunset rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">HomestayHub</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/homestays" className="text-muted-foreground hover:text-primary transition-smooth">
              Find Homestays
            </Link>
            <Link to="/attractions" className="text-muted-foreground hover:text-primary transition-smooth">
              Attractions
            </Link>
            <Link to="/favorites" className="text-muted-foreground hover:text-primary transition-smooth">
              Favorites
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth">
              About
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link to="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            
            {user ? (
              <>
                <Link to="/become-host">
                  <Button variant="outline" className="hidden md:flex">
                    Become a Host
                  </Button>
                </Link>
                <Button variant="adventure" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/become-host">
                  <Button variant="outline" className="hidden md:flex">
                    Become a Host
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="adventure">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;