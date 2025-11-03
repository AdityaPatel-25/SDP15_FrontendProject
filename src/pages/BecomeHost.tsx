import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavigationHeader from "@/components/NavigationHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Home, MapPin, Building, DollarSign, Phone } from "lucide-react";
import { z } from "zod";

const hostApplicationSchema = z.object({
  propertyName: z.string().min(3, "Property name must be at least 3 characters").max(100),
  propertyType: z.string().min(1, "Please select a property type"),
  location: z.string().min(5, "Location must be at least 5 characters").max(200),
  description: z.string().min(50, "Description must be at least 50 characters").max(1000),
  numberOfRooms: z.number().min(1, "Must have at least 1 room").max(50),
  pricePerNight: z.number().min(10, "Price must be at least $10").max(10000),
  phone: z.string().min(10, "Please enter a valid phone number").max(20),
});

const BecomeHost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "",
    location: "",
    description: "",
    numberOfRooms: "",
    pricePerNight: "",
    phone: "",
  });

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (!session) {
        toast.error("Please sign in to become a host");
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session && event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      const validated = hostApplicationSchema.parse({
        propertyName: formData.propertyName,
        propertyType: formData.propertyType,
        location: formData.location,
        description: formData.description,
        numberOfRooms: parseInt(formData.numberOfRooms),
        pricePerNight: parseFloat(formData.pricePerNight),
        phone: formData.phone,
      });

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to submit an application");
      }

      // Insert application
      const { error } = await supabase.from("host_applications").insert({
        user_id: user.id,
        property_name: validated.propertyName,
        property_type: validated.propertyType,
        location: validated.location,
        description: validated.description,
        number_of_rooms: validated.numberOfRooms,
        price_per_night: validated.pricePerNight,
        phone: validated.phone,
      });

      if (error) throw error;

      toast.success("Application submitted successfully! We'll review it and get back to you soon.");
      
      // Reset form
      setFormData({
        propertyName: "",
        propertyType: "",
        location: "",
        description: "",
        numberOfRooms: "",
        pricePerNight: "",
        phone: "",
      });

      // Navigate to homestays after a brief delay
      setTimeout(() => navigate("/homestays"), 2000);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to submit application");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-sunset bg-clip-text text-transparent">
              Become a Host
            </h1>
            <p className="text-muted-foreground text-lg">
              Share your property with travelers and start earning today
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Host Application</CardTitle>
              <CardDescription>
                Fill out the form below and we'll review your application within 48 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">
                    <Home className="w-4 h-4 inline mr-2" />
                    Property Name
                  </Label>
                  <Input
                    id="propertyName"
                    placeholder="Cozy Mountain Cabin"
                    value={formData.propertyName}
                    onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">
                    <Building className="w-4 h-4 inline mr-2" />
                    Property Type
                  </Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homestay">Homestay</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="cottage">Cottage</SelectItem>
                      <SelectItem value="farmstay">Farmstay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, State/Province, Country"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, amenities, nearby attractions, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfRooms">Number of Rooms</Label>
                    <Input
                      id="numberOfRooms"
                      type="number"
                      min="1"
                      placeholder="3"
                      value={formData.numberOfRooms}
                      onChange={(e) => setFormData({ ...formData, numberOfRooms: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerNight">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Price per Night (USD)
                    </Label>
                    <Input
                      id="pricePerNight"
                      type="number"
                      min="10"
                      step="0.01"
                      placeholder="75.00"
                      value={formData.pricePerNight}
                      onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Contact Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BecomeHost;